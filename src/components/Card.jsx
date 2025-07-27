const Card = ({ icon: Icon, title, value, color }) => {
  return(
    <div className="flex items-center gap-4 bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
    <div className={`p-2 rounded-full text-white ${color}`}>
      <Icon className="text-lg" />
    </div>
    <div>
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
  )
}
export default Card;