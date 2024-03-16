import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-auto flex-col items-center justify-between p-24">
      <section className="flex flex-col items-center justify-center gap-10">
        <h1 className="text-5xl font-bold">Dzap</h1>
        <p className="text-2xl text-center">Simplifying DeFi Swaps</p>
        <p className="text-lg text-center">
          Batch Swap or start Dollar Cost Averaging (DCA) without hassle.
        </p>
      </section>
      <section className="flex gap-10">
        <Button className="min-w-[100px]">
          <Link href="/main">Launch App</Link>
        </Button>
        <Button className="min-w-[100px]" variant={'secondary'}>
          Read docs
        </Button>
      </section>
    </main>
  );
}
