
export default function Page1() {
  return (
    <div>
      <p>页面 1</p>
      {/* 不能直接使用 location.href，会导致刷新主应用 */}
      <button onClick={() => window.location.href = "./page2"}>Go 页面2</button>
    </div>
  );
}
