import React from "react";
export default (props) => {
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white overflow-hidden">
				<div className="self-stretch h-12 mx-4">
				</div>
				<div className="flex flex-col items-center self-stretch py-10 mx-[29px]">
					<div className="flex flex-col items-center w-[448px]">
						<div className="flex flex-col self-stretch bg-white p-[45px] gap-7 rounded-3xl border border-solid border-[#E4E4E7CC]" 
							style={{
								boxShadow: "0px 4px 25px #00000005"
							}}>
							<div className="flex flex-col self-stretch gap-2">
								<div className="flex flex-col items-start self-stretch">
									<span className="text-zinc-950 text-[32px] font-bold" >
										Create PIN Code
									</span>
								</div>
								<span className="text-zinc-500 text-sm" >
									Set up your 6-digit security PIN to protect and access\nyour store account.
								</span>
								<div className="flex flex-col items-center self-stretch pt-2">
									<div className="flex items-center py-1.5 px-3.5 rounded-[9999px]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/82g18iz4_expires_30_days.png"} 
											className="w-[11px] h-[11px] mr-2 rounded-[9999px] object-fill"
										/>
										<span className="text-zinc-700 text-xs mr-2" >
											+63 912 345 6789
										</span>
										<span className="text-zinc-300 text-xs mr-[9px]" >
											•
										</span>
										<span className="text-zinc-500 text-xs" >
											Edit
										</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col self-stretch gap-6">
								<div className="flex flex-col self-stretch pb-2 gap-2">
									<div className="flex flex-col items-center self-stretch">
										<span className="text-zinc-800 text-xs font-bold" >
											Enter your 6-digit security PIN
										</span>
									</div>
									<div className="flex justify-center items-center self-stretch py-2 gap-2.5">
										<button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border border-solid border-neutral-900" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<span className="text-gray-500 text-xl font-bold" >
												•
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border border-solid border-[#E8E3DD]" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<span className="text-gray-500 text-xl font-bold" >
												•
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border border-solid border-[#E8E3DD]" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<span className="text-gray-500 text-xl font-bold" >
												•
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border border-solid border-[#E8E3DD]" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<span className="text-gray-500 text-xl font-bold" >
												•
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border border-solid border-[#E8E3DD]" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<span className="text-gray-500 text-xl font-bold" >
												•
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border border-solid border-[#E8E3DD]" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<span className="text-gray-500 text-xl font-bold" >
												•
											</span>
										</button>
									</div>
									<div className="flex items-center self-stretch px-[26px] gap-[5px]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/w7eir2wp_expires_30_days.png"} 
											className="w-2.5 h-2.5 object-fill"
										/>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-zinc-400 text-[11px]" >
												Must be 6 digits. Avoid sequential numbers like 123456.
											</span>
										</div>
									</div>
								</div>
								<button className="flex justify-center items-center self-stretch bg-[#111111] text-left py-2.5 gap-[9px] rounded-xl border-0" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}
									onClick={()=>alert("Pressed!")}>
									<span className="text-white text-sm" >
										Create PIN &amp; Continue
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/obotkvn8_expires_30_days.png"} 
										className="w-[9px] h-[9px] rounded-xl object-fill"
									/>
								</button>
								<div className="flex flex-col items-center self-stretch py-1">
									<span className="text-zinc-500 text-xs" >
										Back to Phone Registration
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-center pt-8">
							<div className="flex flex-col items-center pt-8">
								<div className="flex items-center gap-2">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/5ivw8qsc_expires_30_days.png"} 
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
			</div>
		</div>
	)
}