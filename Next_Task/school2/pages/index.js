import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <h1>Fetch data with API in server component</h1>
            <Link href="/productlist">Go to product page</Link>
        </main>
    );
}
