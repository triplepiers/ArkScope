# 实现思路

> 复刻来源：[明日方舟：终末地](https://endfield.hypergryph.com/#lore)


- 整体思路：将展示对象组织成一批真实的 3D 点坐标，再用 `THREE.Points` 和 `ShaderMaterial` 渲染。

  每一帧中，CPU 侧只做位置缓动：`actor.positions[x] += (actor.targets[x] - actor.positions[x]) * speed;`

- 主要参数：

  | 属性 | 说明 |
  | :- | :- |
  | `position` | 当前粒子位置 |
  | `target` | 当前模型的目标位置 |
  | `seed` | 用于随机脉冲和 glitch |
  | `alpha` | 控制粒子显隐 |

- 目前支持 3 组内置的程序化生成点云：

  - `ARKSHIP`: 椭球舰体、机翼、尾环和喷口组成的飞船轮廓。
  - `ANCHOR`: 圆环、竖杆、横梁、弧形锚爪组成的锚状结构。
  - `REACTOR`: 多方向圆环、核心柱体和螺旋点线组成的反应堆结构。

- 对于上传的自定义遮罩：

  - 图片：使用 Canvas 2D 读取图片像素，随后转换成带深度的 3D 浮雕点云。
  
      有效像素会映射到 `x/y`，亮度或 alpha 会参与生成 `z` 深度和透明度，因此上传图也可以参与 3D 旋转。


### 模型切换

- 保留官网 `#lore` 的双点云层思路：场景里始终有 `frontActor` 和 `backActor` 两个 `THREE.Points`、切换时交换两者身份：

  ```js
  const oldFront = frontActor;
  frontActor = backActor;
  backActor = oldFront;
  ```

- 新模型写入 `frontActor`，旧模型留在 `backActor` 中淡出。这样切换时不需要销毁 WebGL 对象，也能让新旧模型同时存在一段时间。

#### Rebuild（自底向上）

- 切换到新模型时，新 Actor 的粒子不会直接出现在目标点，而是先被放到模型下方，再缓动回目标位置：

  ```js
  actor.positions.set([
    point.x + random(-70, 70),
    -maxDisplayRadius - random(120, 360),
    point.z + random(-180, 180)
  ], base3);
  ```

- Shader 中的 `uReveal` 会控制自底向上的显影范围。扫描线以下的粒子逐步变得可见，形成 rebuild 效果：

  ```glsl
  float revealAlpha = 1.0 - smoothstep(uReveal, uReveal + 0.075, worldY);
  vAlpha = alpha * revealAlpha;
  ```

#### 旋转加速

- 短时间把自动旋转速度提升到约 `20x`，停留一段时间后再恢复正常。

  ```js
  if (elapsedMs < 400) {
    return lerp(baseSpeed, baseSpeed * 20, ease);
  }
  ```

- 旋转角度仍然由每帧自动累加产生：

  ```js
  pointer.targetRotationY += delta * currentAutoRotationSpeed;
  ```

  因此，切换时会出现快速甩动感，但最终角度不会被硬编码。

#### 扫描线、光束和 Glitch

- 切换期会不断从扫描线附近挑选粒子点，生成白色光束。光束终点来自当前模型点云，因此它和粒子有空间关系；生成光束时还会轻微扰动目标附近的一小簇粒子：

  ```js
  spawnRays(4, { scanY: -340 + scan * 680, actor: frontActor });
  kickParticleCluster(actor, targetIndex, 5);
  ```

- 常驻展示时会低频触发 glitch，切换时提高触发频率。Glitch 在 vertex shader 中表现为某个水平带的粒子横向错位：

  ```glsl
  float glitchBand = 1.0 - smoothstep(0.0, 0.035, abs(worldY - uGlitchY));
  p.x += glitchBand * uGlitchPower * direction;
  ```
