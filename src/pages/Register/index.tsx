import React from "react";
export default (props) => {
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white px-4 overflow-hidden">
				<div className="self-stretch h-12 pt-8 pl-6">
				</div>
				<div className="flex flex-col items-center self-stretch py-[41px] gap-[1px]">
					<div className="bg-[#FFFFFF00] w-[460px] py-10 px-[41px] rounded-[28px]" 
						style={{
							boxShadow: "0px 2px 10px #00000005"
						}}>
						<div className="flex flex-col self-stretch mb-[25px] gap-2">
							<div className="flex flex-col items-start self-stretch">
								<span className="text-zinc-950 text-[28px] font-bold" >
									Register Phone Number
								</span>
							</div>
							<div className="flex flex-col self-stretch">
								<span className="text-zinc-500 text-sm" >
									Enter your registered store mobile number to receive\nverification code.
								</span>
							</div>
						</div>
						<div className="flex flex-col self-stretch pt-1 mb-6 gap-6">
							<div className="flex items-center self-stretch bg-white py-[1px] px-[15px] rounded-xl border border-solid border-zinc-300">
								<div className="flex flex-col shrink-0 items-center">
									<div className="flex items-center gap-1.5">
										<span className="text-zinc-700 text-base font-bold" >
											🇵🇭
										</span>
										<span className="text-zinc-800 text-sm font-bold" >
											+63
										</span>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/gb1vko34_expires_30_days.png"} 
											className="w-3.5 h-3.5 object-fill"
										/>
									</div>
								</div>
								<div className="flex flex-1 flex-col items-start py-4">
									<span className="text-zinc-400 text-[15px]" >
										912 345 6789
									</span>
								</div>
							</div>
							<button className="flex flex-col items-center self-stretch bg-zinc-900 text-left py-3.5 rounded-xl border-0" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}
								onClick={()=>alert("Pressed!")}>
								<span className="text-white text-[15px] font-bold" >
									Continue
								</span>
							</button>
						</div>
						<div className="flex justify-center items-start self-stretch pt-[22px] gap-[5px]">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/nixasdjr_expires_30_days.png"} 
								className="w-3.5 h-3.5 object-fill"
							/>
							<span className="text-zinc-400 text-xs" >
								End-to-end encrypted verification
							</span>
						</div>
					</div>
					<div className="flex flex-col items-center pt-8">
						<div className="flex items-center gap-2">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/lchnp7m1_expires_30_days.png"} 
								className="w-7 h-7 rounded-[9999px] object-fill"
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