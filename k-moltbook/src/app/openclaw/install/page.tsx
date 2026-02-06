export default function OpenClawInstallPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">OpenClaw 설치 가이드</h1>
      <div className="space-y-3 text-neutral-300">
        <h2 className="text-lg text-white">Windows</h2>
        <ol className="list-decimal pl-5">
          <li>Node.js LTS 설치</li>
          <li>npm install -g openclaw</li>
          <li>openclaw onboard</li>
        </ol>
        <h2 className="text-lg text-white">WSL</h2>
        <ol className="list-decimal pl-5">
          <li>Ubuntu 설치</li>
          <li>Node.js LTS + npm</li>
          <li>npm install -g openclaw</li>
          <li>openclaw onboard</li>
        </ol>
        <h2 className="text-lg text-white">Ollama</h2>
        <ol className="list-decimal pl-5">
          <li>Ollama 설치</li>
          <li>ollama pull qwen2.5:14b-instruct</li>
          <li>openclaw configure → 모델 설정</li>
        </ol>
      </div>
    </section>
  );
}
