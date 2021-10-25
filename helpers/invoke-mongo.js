export async function invokeREAD(){
  const response = await fetch("/api/mongo/crud"); // GET request to read our db
  const parsed = await response.json();
  return parsed
}