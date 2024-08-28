import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";
import { render } from "@react-email/render";
export const confirmEmail = (details: {
  id: string;
  details: string;
  extra?: string;
}) => {
  return render(
    <Html lang="en">
      <Text>確認訂單 - 編號:{details.id}</Text>
      <Hr />

      <Text>我們已經收到並確認你的預約</Text>

      <Text>詳情: {details.details}</Text>

      {details.extra && <Text>{details.extra}</Text>}
    </Html>
  );
};
