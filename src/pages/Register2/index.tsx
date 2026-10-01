import React from "react";
export default (props) => {
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white overflow-hidden">
				<div className="self-stretch h-[76px]">
				</div>
				<div className="flex flex-col items-center self-stretch pt-0.5">
					<div className="flex flex-col bg-[#FFFFFF00] w-[460px] py-10 px-[41px] gap-7 rounded-[28px]" 
						style={{
							boxShadow: "0px 4px 6px #00000003"
						}}>
						<div className="flex flex-col self-stretch gap-1">
							<div className="flex flex-col items-start self-stretch">
								<span className="text-neutral-900 text-[26px] font-bold" >
									Reset PIN Code
								</span>
							</div>
							<div className="flex flex-col items-start self-stretch">
								<span className="text-neutral-500 text-sm" >
									Create a new 6-digit security PIN for your account.
								</span>
							</div>
						</div>
						<div className="flex flex-col self-stretch gap-6">
							<div className="flex flex-col self-stretch gap-2">
								<div className="flex flex-col items-start self-stretch">
									<span className="text-neutral-600 text-xs font-bold" >
										ENTER NEW PIN
									</span>
								</div>
								<div className="flex items-center self-stretch">
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-3 px-4 mr-[22px] rounded-xl border border-solid border-neutral-900"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-[17px] mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-[17px] mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-[17px] mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-4 mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-4 rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
								</div>
							</div>
							<div className="flex flex-col self-stretch pb-2 gap-2">
								<div className="flex flex-col items-start self-stretch">
									<span className="text-neutral-600 text-xs font-bold" >
										CONFIRM NEW PIN
									</span>
								</div>
								<div className="flex items-center self-stretch">
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-4 mr-[22px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-[17px] mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-[17px] mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-4 mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-4 mr-[23px] rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#FAFAFAB0] text-left py-3 px-4 rounded-xl border border-solid border-neutral-200"
										onClick={()=>alert("Pressed!")}>
										<span className="text-gray-500 text-xl font-bold" >
											•
										</span>
									</button>
								</div>
							</div>
							<button className="flex flex-col items-center self-stretch bg-neutral-900 text-left py-3 rounded-xl border-0" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}
								onClick={()=>alert("Pressed!")}>
								<span className="text-white text-[15px]" >
									Change PIN Code
								</span>
							</button>
							<div className="flex flex-col items-center self-stretch pt-1.5">
								<span className="text-neutral-500 text-[13px]" >
									Back to Login
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center pt-8 mb-[49px]">
						<div className="flex items-center gap-2">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/wlbawzoi_expires_30_days.png"} 
								className="w-7 h-7 object-fill"
							/>
							<span className="text-zinc-500 text-xs font-bold" >
								Vjay&#39;s Bike Parts &amp; Accessories
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}