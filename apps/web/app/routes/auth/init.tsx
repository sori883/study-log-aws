import type { Route } from "./+types/init";
import cookie from "cookie";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, redirect } from "react-router";
import { z } from "zod";
import { jwtVerifier } from "../../../auth/jwt";
import { updateInitUser } from "../../db/user/updateInitUser";

const schema = z.object({
  displayName: z.string().min(1, "表示名は必須です"),
  username: z.string().min(1, "ユーザ名は必須です"),
});

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Honoでリダイレクトしているので、Cookieからid_tokenを取得する
  const id_token = cookie.parse(request.headers.get("Cookie") || "").id_token;
  if (!id_token) { return redirect("/login"); }

  await jwtVerifier.hydrate();
  const jwtPayload = await jwtVerifier.verify(id_token);

  await updateInitUser({
    username: submission.value.username,
    displayName: submission.value.displayName,
    providerUsername: jwtPayload["cognito:username"],
  });
}

export default function Init() {
  const [ form, { username, displayName } ] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <div>
        <label>ユーザ名</label>
        <input {...getInputProps(username, { type: "text" })} />
        {username.errors && (
          <div>
            {username.errors.map((e, index) => (
              <p key={index}>{e}</p>
            ))}
          </div>
        )}
       <label>表示名</label>
        <input {...getInputProps(displayName, { type: "text" })} />
        {displayName.errors && (
          <div>
            {displayName.errors.map((e, index) => (
              <p key={index}>{e}</p>
            ))}
          </div>
        )}
      </div>
      <button type="submit">登録</button>
    </Form>
  );
}
