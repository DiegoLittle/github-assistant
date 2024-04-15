import { NextApiRequest, NextApiResponse } from 'next';

const allowedMethods = ['GET'];

const get = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    
    res.status(200).json({ id })
    return
}

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } =  typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    res.status(200).json({ id })
    return
}

const put = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } =  typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    res.status(200).json({ id })
    return
}

const del = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } =  typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    res.status(200).json({ id })
    return
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (!allowedMethods.includes(req.method as string)) {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    switch (req.method) {
        case 'GET':
            await get(req, res)
            return
        case 'POST':
            await post(req, res)
            return
        case 'PUT':
            await put(req, res)
            return
        case 'DELETE':
            await del(req, res)
            return
        default:
            break;
    }
}
export default requestHandler
