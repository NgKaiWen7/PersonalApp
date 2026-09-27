

export function NoteList() {
  return (
    <div
      className="min-h-screen"
      style={{ display: "flex" }}
    >
      <main className="flex-1 min-w-0">
        <div className="h-screen p-7">
          <input
            className="w-full text-2xl font-semibold bg-transparent outline-none"
            placeholder="Note title"
          />

          <textarea
            className="mt-6 w-full h-[calc(100vh-150px)] resize-none bg-transparent outline-none"
            placeholder="Start writing..."
          />
        </div>
      </main>
    </div>
  );
}
