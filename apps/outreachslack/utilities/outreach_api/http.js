const bearerToken =
  "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6InN0YWdpbmcudXMtZWFzdC0yXzIwMjAwODA2MTIwNzMyIiwibm9uY2UiOiIwclBha1hKNDRwbEp4Wm1xcnhCZTF3PT0ifQ.eyJhY3QiOnsiaXNzIjoia3ViZXJuZXRlcyIsInN1YiI6ImF1dGhuaWRlbnRpdHlAb3V0cmVhY2guY2xvdWQiLCJ0eXAiOiJrOHMifSwiYXVkIjoiZnJvbnRlbmQtc2VydmljZXNAb3V0cmVhY2guY2xvdWQiLCJiZW50byI6InN0YWdpbmcxYSIsImRvbWFpbiI6Im91dHJlYWNoLXN0YWdpbmcuY29tIiwiZXhwIjoxNzE4Njk0ODA3LCJpYXQiOjE3MTg2NzMyMDcsImlzcyI6Im1pbnQiLCJuYmYiOjE3MTg2NzMwODcsIm9yZ19ndWlkIjoiNDgzYWVhZmItMDBlNS0xMWU2LThiMDUtMDZmZjJiOTgyYmNiIiwib3JnX3Nob3J0bmFtZSI6Im91dHJlYWNoIiwib3JnX3VzZXJfaWQiOjE2NDAsInNjb3BlcyI6InByb2ZpbGUgZW1haWwgcmVzb3VyY2VzLmFsbCBvcGVuaWQgQUFBPSIsInN1YiI6ImFtYXIudGhvbmRhcHUrc3RhZ2luZ0BvdXRyZWFjaC5pbyIsInVzZXJfZ2xvYmFsX2lkIjoiODdmYWNkYTUtNWZkNC0zZDgyLTkzMmUtZjU3Mjg0ZThkYjZhIn0.iufHYxq4BnVtpn-MkxoPNf1udhwlv5a3gMrM60GKmXnNieKyebeE4dCUqmUEn8Ub5_iD_CgWekvh4GzYVPz-GA";

const Get = async (url) => {
  const response = await fetch(url, {
    headers: new Headers({
      Authorization: bearerToken,
      "Content-Type": "application/json",
    }),
  });
  // console.log("Response: ", response);
  if (response.status != 200) {
    const body = await response.text();
    const error = `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
    return { error, data: null };
  }
  return { data: await response.json(), error: null };
};

const Post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      Authorization: bearerToken,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  });

  // console.log("response: ", response);

  const { errors, data } = await response.json();
  if (response.status != 200) {
    // const body = await response.text();
    console.log("Response JSON: ", errors);
    const error = `Failed to call my endpoint! (status: ${response.status}, body: ${errors})`;
    // console.log("error: ", error);
    return { errors, data: null };
  }
  return { data, errors: null };
};

const Put = async (url, body) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: new Headers({
      Authorization: bearerToken,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  });

  if (response.status != 200) {
    const body = await response.text();
    const error = `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
    return { error };
  }
  return response.json();
};

const Delete = async (url) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: new Headers({
      Authorization: bearerToken,
      "Content-Type": "application/json",
    }),
  });

  if (response.status != 200) {
    const body = await response.text();
    const error = `Failed to call my endpoint! (status: ${response.status}, body: ${body})`;
    return { error, data: null };
  }
  return { data: response.json(), error: null };
};

const MarkComplete = async (id) => {
  const url = `${process.env.OUTREACH_TASK_STAGING_API_URL}/${id}/actions/markComplete`;
  console.log("url: ", url);
  return await Post(url, {});
};

module.exports = {
  Get,
  Post,
  Put,
  Delete,
  MarkComplete,
};