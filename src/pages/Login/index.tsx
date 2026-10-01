import React from "react";
export default (props) => {
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white overflow-hidden">
				<div className="self-stretch h-[68px]">
				</div>
				<div className="flex flex-col items-center self-stretch py-[73px]">
					<div className="flex flex-col bg-white w-[448px] p-[45px] gap-7 rounded-3xl border border-solid border-[#E4E4E7CC]" 
						style={{
							boxShadow: "0px 4px 25px #00000005"
						}}>
						<div className="flex flex-col self-stretch gap-[7px]">
							<div className="flex flex-col items-start self-stretch">
								<span className="text-zinc-950 text-[32px] font-bold" >
									Welcome back
								</span>
							</div>
							<div className="flex flex-col items-start self-stretch">
								<span className="text-zinc-500 text-sm" >
									Let&#39;s pick up where you left off
								</span>
							</div>
						</div>
						<div className="flex flex-col self-stretch gap-8">
							<div className="flex flex-col self-stretch gap-[7px]">
								<div className="flex flex-col items-center self-stretch">
									<span className="text-zinc-800 text-xs font-bold" >
										Enter your 6-digit security PIN
									</span>
								</div>
								<div className="flex justify-center items-center self-stretch py-2 gap-2.5">
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-[17px] rounded-xl border border-solid border-[#E8E3DD]" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-[17px] rounded-xl border border-solid border-[#E8E3DD]" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-[17px] rounded-xl border border-solid border-[#E8E3DD]" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-[17px] rounded-xl border border-solid border-[#E8E3DD]" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-[17px] rounded-xl border border-solid border-[#E8E3DD]" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-[17px] rounded-xl border border-solid border-[#E8E3DD]" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
								</div>
							</div>
							<button className="flex flex-col items-center self-stretch bg-[#111111] text-left py-[9px] rounded-xl border-0" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}
								onClick={()=>alert("Pressed!")}>
								<span className="text-white text-sm" >
									Authorize &amp; Enter
								</span>
							</button>
							<div className="flex flex-col items-center self-stretch gap-[5px]">
								<span className="text-zinc-500 text-xs" >
									Forgot PIN?
								</span>
								<span className="text-zinc-400 text-[11px]" >
									Reset via registered phone
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}