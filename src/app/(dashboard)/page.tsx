export default function Home() {
  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight text-primary">
        Dashboard
      </h1>
      {Array<number>(10)
        .fill(0)
        .map((_, i) => (
          <p key={i} className="py-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
            est doloremque obcaecati nobis odio modi dolores? Et assumenda
            magnam facilis error maiores enim, eos, alias laborum, facere
            temporibus perferendis officia!
          </p>
        ))}
    </>
  )
}
