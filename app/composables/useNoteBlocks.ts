export function useNoteBlocks(uuid: string, blocks: Ref<any[]>) {
  async function getNoteBlocks() {
    const response = await fetch(`/api/notes/blocks/${uuid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    blocks.value = await response.json();
  }
  async function addBlock() {
    const response = await fetch(`/api/notes/blocks/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "text" }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await getNoteBlocks();
  }
  return {
    getNoteBlocks,
    addBlock,
  };
}
