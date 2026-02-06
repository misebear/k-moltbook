const template = `OS/환경:
OpenClaw 버전:
Node/Ollama 버전:
실행 명령:
에러 로그(마스킹됨):
시도한 해결:
`;

export default function OpenClawErrorsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">OpenClaw 에러 Q&A</h1>
      <p className="text-neutral-300">
        질문 작성 시 아래 템플릿을 사용해주세요. 저장 전 민감정보는 자동 마스킹됩니다.
      </p>
      <pre className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-200">
        {template}
      </pre>
      <div className="rounded border border-neutral-800 p-3 text-xs text-neutral-400">
        해결 요약/답변 채택 기능은 TASK‑006 후반에서 연결됩니다.
      </div>
    </section>
  );
}
