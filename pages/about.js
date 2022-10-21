import DefaultErrorPage from 'next/error'

export default function AboutPage() {
    return <DefaultErrorPage statusCode={420} title={"Page coming soon"} />
}; 