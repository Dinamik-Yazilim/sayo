import Dashboard from './dashboard/page'
import { Metadata } from "next"
import { pageMeta } from '@/lib/meta-info'
export const metadata: Metadata = pageMeta('Home')


const IndexPage = () => {
  return (<Dashboard />)
}

export default IndexPage
