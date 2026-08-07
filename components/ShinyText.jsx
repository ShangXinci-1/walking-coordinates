// ShinyText：光泽扫过文字（金色渐变流动，适配站点主题）
// 纯 CSS 实现：background-clip text + background-position 循环动画。
// 无状态组件，可作为 server 组件使用。
import "../styles/components/shiny-text.css";

/**
 * @param {Object} props
 * @param {string} props.text 文字内容
 * @param {string} [props.className] 附加类名
 * @param {number} [props.speed] 光泽扫过周期（秒），默认 3
 */
export default function ShinyText({ text, className = "", speed = 3 }) {
  return (
    <span
      className={`shiny-text${className ? ` ${className}` : ""}`}
      style={{ "--shine-speed": `${speed}s` }}
    >
      {text}
    </span>
  );
}
