import { useEffect, useState } from "react";
import { rationApi } from "./server";

//type:get,getOne,add,delete,modify
export async function fetchRation(type, id, toSendData) {
  const response = await fetch(rationApi(id), {
    method: type,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toSendData),
  });
  const data = await response.json();
  return data;
}

export function useRation(type, id, toSendData) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRation(type, id, toSendData)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(`error:${e}`);
        setLoading(false);
      });
  }, [type, id, toSendData]);

  return { data, loading };
}
