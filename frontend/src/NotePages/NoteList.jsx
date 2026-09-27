
import { Sidebar } from "../Sidebar.jsx";

function NoteLayout({ children }) {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}

export function NoteList() {
  return (
    <div
      className="min-h-screen"
      style={{ display: "flex" }}
    >
      <Sidebar />

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
//
// export function NoteList() {
//   return (
//     <NoteLayout>
//       <NoteEditor />
//     </NoteLayout>
//   );
// }
