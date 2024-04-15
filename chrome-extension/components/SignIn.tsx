import React, { FC, useEffect } from 'react'
import { PUBLIC_HOST } from '../utils/consts'
import { store } from '../utils/store'
import Button from './SigninButton'

type Props = {
className?: string
} & React.HTMLAttributes<HTMLDivElement>

const SignIn: FC<Props> = ({
className,
...props
}: Props): JSX.Element => {

    const [url, setUrl] = React.useState(null)

    

    useEffect(() => {
        async function handleLoad(){
            await store.initalizeUser()
            const { key, secret } = store.setKeySecret()
    
            setUrl(`${PUBLIC_HOST}/signin?&k=${key}`)
            async function postKeypair(key, secret) {
                console.log('key', key, 'secret', secret);
                
                const userId = store.user.anonymousId
                const req = await fetch(PUBLIC_HOST + `/api/trpc/onetime`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key,
                        secret,
                        anonymousId: userId,
                    })
                })
                // sendToContentScript({
                //     name: "fetch",
                //     body: {
                //         type: FetchActionTypes.POST_ONETIME_KEYPAIR,
                //         url:PUBLIC_HOST + '/api/trpc/onetime',
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json"
                //         },
                //         body: JSON.stringify({
                //             key,
                //             secret,
                //             anonymousId: userId,
                //         })
                //     }
                //   }).then((res) => {
                //     console.log('res', res);
                    
                //   })
               
            }
            postKeypair(key, secret)
        }
        handleLoad()
    }, []);

    const handleSignIn = async () => {
        window.open(url, '_blank')
        let pollCount = 0
        let poll = setInterval(() => {
            async function fetchUserOnetime() {
                const key = store.user.key
                const secret = store.user.secret
                const req = await fetch(PUBLIC_HOST + `/api/trpc/onetime`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key,
                        secret,
                        get: true,
                    })
                })
                if (req.status === 200) {
                    const res = await req.json()
                    console.log('res', res);

                    store.authenticateUser(res)
                    store.setPage('home')
                    clearInterval(poll)
                }
                if (pollCount > 30) {
                    clearInterval(poll)
                }

                pollCount++
            }
            fetchUserOnetime()
        }, 5000)
    }

    return (
        <div
        className='flex flex-col items-center justify-center'
    >
        <img
            style={{
                width: '100px',
                height: '100px',
                marginTop: '50px',
            }}
            src="https://synesthesia-frontend.s3.us-east-2.amazonaws.com/cms/public-assets/synesthesia-cms/logo.svg" />
        <h1
            style={{
                fontSize: '30px',
                fontWeight: 700,
                marginBottom: "50px"
            }}
        >Web Factory AI</h1>
        <Button
            onClick={handleSignIn}
        >
            Sign in
        </Button>
        <div className='text-center text-neutral-4 mt-3 text-[13px] tracking-[1%] leading-[135%] my-auto font-inter'>
            This will sign you in your browser
            {/* By signing in, you agree to our <a href="https://webfactory.com/terms" target="_blank" className='text-primary'>Terms of Service</a> and <a href="https://webfactory.com/privacy" target="_blank" className='text-primary'>Privacy Policy</a>. */}
        </div>
    </div>
    )
}

export default SignIn