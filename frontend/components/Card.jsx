export default function Card(props) {
  return (
    <div className="relative block bg-black group">
      <img
        className="absolute w-full h-full transition-opacity group-hover:opacity-50"
        src={props.url}
        alt=""
      />
      <div className="relative p-8">
        <p className="text-sm font-medium tracking-widest text-pink-500">
          {props.address}
        </p>

        <p className="text-2xl font-bold text-white">{props.name}</p>

        <div className="mt-64">
          <div className="transition-all transform translate-y-8 opacity-0  group-hover:opacity-100 group-hover:translate-y-0">
            <p className="text-sm text-white">
              This image has {props.likes} likes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
