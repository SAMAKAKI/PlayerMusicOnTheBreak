import { AudioPlayer, ProposalsList } from "../../components"

export const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-[90%]">
      <div className="w-3/5">
        <AudioPlayer src="/1.mp3"/>
      </div>
      <div className="w-2/5 h-full">
        <ProposalsList />
      </div>
    </div>
  )
}

