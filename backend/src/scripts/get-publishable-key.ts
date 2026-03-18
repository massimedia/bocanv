import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ExecArgs } from "@medusajs/framework/types"

export default async function getPublishableKey({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title"],
    filters: { type: "publishable" },
  })
  const key = data?.[0]
  if (key?.token) {
    console.log("\nPublishable API Key:", key.token)
    console.log("Add to storefront/.env.local: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" + key.token + "\n")
  } else {
    console.log("No publishable key found. Run: npm run seed")
  }
}
