export async function fakeApiCall(response, delay = 400) {
  await new Promise((res) => setTimeout(res, delay));
  return response;
}
