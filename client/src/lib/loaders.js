import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
export const detailPageLoader = async ({ params }) => {
  const { id } = params;

  try {
    const postPromise = apiRequest("/users/profilePosts");
    const requestPromise = apiRequest(`/requests/${id}`);
    return defer({
      postResponse: postPromise,
      requestResponse: requestPromise,
    });
  } catch (error) {
    console.error('Error in detailPageLoader:', error);
    throw new Error(`Failed to fetch necessary data: ${error.message}`);
  }
};


