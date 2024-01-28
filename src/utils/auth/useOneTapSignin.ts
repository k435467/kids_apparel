import { useState } from 'react'
import { useSession, signIn, SignInOptions } from 'next-auth/react'

interface OneTapSigninOptions {
  parentContainerId?: string
}

export const useOneTapSignin = (
  options?: OneTapSigninOptions & Pick<SignInOptions, 'redirect' | 'callbackUrl'>,
) => {
  const { parentContainerId } = options || {}
  const [isLoading, setIsLoading] = useState(false)

  console.log('dbg_111 hook been called')

  // Taking advantage in recent development of useSession hook.
  // If user is unauthenticated, google one tap ui is initialized and rendered
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      if (!isLoading) {
        const { google } = window as unknown as any
        if (google) {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            // auto_select: true, // TODO: Uncomment this line if you want to skip the one tap UI
            callback: async (response: any) => {
              setIsLoading(true)

              // Here we call our Provider with the token provided by google
              await signIn('googleonetap', {
                credential: response.credential,
                redirect: true,
                ...options,
              })
              setIsLoading(false)
            },
            prompt_parent_id: parentContainerId,
          })

          // Here we just console.log some error situations and reason why the google one tap
          // is not displayed. You may want to handle it depending on your application
          google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log('getNotDisplayedReason ::', notification.getNotDisplayedReason())
            } else if (notification.isSkippedMoment()) {
              console.log('getSkippedReason  ::', notification.getSkippedReason())
            } else if (notification.isDismissedMoment()) {
              console.log('getDismissedReason ::', notification.getDismissedReason())
            }
          })
        }
      }
    },
  })

  return { isLoading }
}
