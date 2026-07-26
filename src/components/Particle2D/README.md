# 实现思路

> 复刻来源：[明日方舟](https://ak.hypergryph.com/#world)

- 自定义遮罩支持
    - 上传图片会先用 `FileReader` 转成 data URL，再由 `Image` 解码，最后居中绘制到的离屏 canvas。
    - 采样时会兼容透明 PNG/SVG，也会根据角落亮度粗略判断黑底白图或白底黑图。

## 核心原理

- 页面中只有一个 WebGL canvas，粒子通过 Three.js 中的一组 `Points`实现、每个粒子用 `position` 和 `color` 两个 BufferAttribute 写入 GPU：

    ```js
    const positions = new Float32Array(particleTotal * 3);
    const colors = new Float32Array(particleTotal * 4);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    ```

- 切换图形时：不会销毁或重建粒子，而是替换当前 `activeModel`。每个粒子持有固定 `index`，然后去追逐新 model 中相同 index 的目标点：

    ```js
    const target = points[p.index];

    p.x += (target.x * scale + offsetX - p.x) / p.speed;
    p.y += (target.y * scale + offsetY - p.y) / p.speed;
    p.z += (target.z - p.z) / p.speed;
    p.a += (target.a - p.a) / p.speed;
    ```

    `shuffle(activeModel.points)` 会在切换时打乱目标点顺序，让运动更像重新聚合，而不是机械地按原顺序平移。

- 点云显示范围由 `displayBounds` 控制。

## 渲染方式

- 粒子使用自生成的径向渐变纹理作为 point sprite：

    ```js
    const texture = new THREE.CanvasTexture(particleCanvas);
    ```

- Vertex shader 根据相机深度计算点大小：

    ```glsl
    gl_PointSize = uPointSize * (180.0 / -mvPosition.z);
    ```

- Fragment shader 用 `gl_PointCoord` 采样 sprite：

    ```glsl
    vec4 tex = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor.rgb, vColor.a) * tex;
    ```

- 材质开启透明和叠加混合：

    ```js
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending
    ```