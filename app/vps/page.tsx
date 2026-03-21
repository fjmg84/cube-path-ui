import ListAllVPS from "@/components/vps/list-all-vps";

export default function VpsPage() {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        VPS
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Lista de instancias VPS disponibles para tu cuenta.
      </p>

      <div className="mt-6">
        <ListAllVPS />
      </div>
    </section>
  );
}
