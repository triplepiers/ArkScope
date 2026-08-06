# ResponsiveDesignCanvas

将固定尺寸的设计稿等比适配到任意容器。组件用 `ResizeObserver` 计算缩放比例，并同步更新占位高度，因此缩放后的内容不会留下空白块。

```vue
<ResponsiveDesignCanvas :design-width="1280" :design-height="838" :min-width="720">
  <FixedLayoutComponent />
</ResponsiveDesignCanvas>
```

- `designWidth` / `designHeight`：原始设计画布尺寸（px）。
- `minWidth`：可用布局宽度下限，默认 **720px**。低于这个阈值时保留可读性，应由页面外层提供横向溢出策略。
- `maxScale`：默认 `1`，避免在宽屏上放大原始设计稿。
