import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  // Function to sort posts by createdAt in descending order
  const sortPostsByDateDescending = (posts) => {
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>جارٍ التحميل...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>خطأ في تحميل المنشورات!</p>}
            >
              {(postResponse) =>
                sortPostsByDateDescending(postResponse.data).map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>جارٍ التحميل...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>خطأ في تحميل المنشورات!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
