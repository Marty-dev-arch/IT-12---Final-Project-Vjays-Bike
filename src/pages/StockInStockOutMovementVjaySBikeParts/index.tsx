import React, {useState} from "react";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white overflow-hidden">
				<div className="flex items-center self-stretch gap-[1px]">
					<div className="bg-white w-[255px] pb-[444px]" 
						style={{
							boxShadow: "0px 1px 3px #2020200D"
						}}>
						<div className="self-stretch py-[18px]">
							<div className="flex items-center self-stretch mb-[21px] ml-6 mr-2 gap-3">
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/y7oeja78_expires_30_days.png"} 
									className="w-12 h-12 rounded-xl object-fill"
								/>
								<div className="flex-1">
									<div className="flex flex-col items-start self-stretch">
										<span className="text-slate-900 text-base font-bold" >
											Vjay&#39;s
										</span>
									</div>
									<div className="flex flex-col items-start self-stretch">
										<span className="text-slate-500 text-[11px]" >
											Bike Parts and Accessories
										</span>
									</div>
								</div>
							</div>
							<div className="self-stretch relative mb-[222px]">
								<div className="self-stretch pt-4 px-4">
									<div className="flex items-center self-stretch py-2.5 mb-1 rounded-lg">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/a1bp4iag_expires_30_days.png"} 
											className="w-5 h-5 mx-3 rounded-lg object-fill"
										/>
										<span className="text-slate-600 text-sm" >
											Dashboard
										</span>
									</div>
									<div className="flex flex-col self-stretch pt-2 mb-[118px] gap-1">
										<div className="flex justify-between items-center self-stretch py-2.5 px-3 rounded-xl" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}>
											<div className="flex shrink-0 items-center gap-3">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/hflqq12x_expires_30_days.png"} 
													className="w-5 h-5 object-fill"
												/>
												<span className="text-slate-600 text-sm font-bold" >
													Products  
												</span>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/hu78n3yc_expires_30_days.png"} 
												className="w-4 h-4 rounded-xl object-fill"
											/>
										</div>
										<div className="flex flex-col self-stretch pl-10 pr-2 gap-1">
											<div className="flex flex-col items-start self-stretch py-1.5">
												<span className="text-slate-500 text-xs" >
													All Parts
												</span>
											</div>
											<div className="flex justify-between items-center self-stretch py-1.5">
												<span className="text-slate-700 text-xs font-bold" >
													Braking System
												</span>
												<div className="flex flex-col shrink-0 items-start bg-red-500 py-0.5 px-1.5 rounded-[9999px]">
													<span className="text-white text-[10px] font-bold" >
														2
													</span>
												</div>
											</div>
											<div className="flex justify-between items-center self-stretch py-1.5">
												<span className="text-slate-500 text-xs" >
													Drivetrain &amp; Chains
												</span>
												<div className="flex flex-col shrink-0 items-start bg-red-500 py-0.5 px-1.5 rounded-[9999px]">
													<span className="text-white text-[10px] font-bold" >
														1
													</span>
												</div>
											</div>
											<div className="flex flex-col items-center self-stretch py-1.5">
												<span className="text-slate-500 text-xs" >
													Gears &amp; Sprockets
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className="self-stretch absolute bottom-[-40px] right-4 left-4 pt-2">
									<div className="flex flex-col items-start self-stretch pl-3">
										<span className="text-slate-400 text-[10px] font-bold" >
											OPERATIONS
										</span>
									</div>
									<div className="flex items-center self-stretch bg-orange-50 pl-3 rounded-lg border border-solid border-orange-200">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/5yf3f1ts_expires_30_days.png"} 
											className="w-5 h-5 mr-3 object-fill"
										/>
										<input
											placeholder="Stock Movement"
											value={input1}
											onChange={(event)=>onChangeInput1(event.target.value)}
											className="flex-1 self-stretch text-orange-700 bg-transparent text-sm py-3 mr-1 border-0"
										/>
									</div>
									<div className="flex items-center self-stretch py-2.5 px-3 mb-10 gap-[42px] rounded-lg">
										<div className="flex flex-1 items-center gap-3">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/zqxrvbe4_expires_30_days.png"} 
												className="w-5 h-5 object-fill"
											/>
											<div className="flex flex-1 flex-col items-start">
												<span className="text-slate-600 text-sm" >
													 Logs History
												</span>
											</div>
										</div>
										<div className="flex flex-col shrink-0 items-start bg-rose-50 py-[1px] px-[7px] rounded border border-solid border-rose-200">
											<span className="text-rose-600 text-[10px] font-bold" >
												New
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center self-stretch py-2.5 pl-3 ml-4 rounded-xl" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}>
								<span className="text-slate-600 text-sm font-bold" >
									Need Help?
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-1 flex-col items-start relative">
						<div className="self-stretch bg-[#FAFAF8]">
							<div className="self-stretch bg-[#FFFFFFF0] h-16">
							</div>
							<div className="self-stretch pt-6 px-6">
								<div className="flex flex-col items-start self-stretch relative mb-5">
									<div className="flex flex-col self-stretch gap-2">
										<div className="flex items-center self-stretch gap-1">
											<span className="text-[#6F6F6F] text-[10px]" >
												OPERATIONS
											</span>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/tyjltryo_expires_30_days.png"} 
												className="w-[3px] h-1.5 object-fill"
											/>
											<span className="text-[#1B1C1C] text-[10px] font-bold" >
												STOCK MOVEMENT
											</span>
										</div>
										<div className="flex justify-between items-center self-stretch">
											<span className="text-[#1B1C1C] text-2xl font-bold" >
												Stock Movement 
											</span>
											<button className="flex flex-col shrink-0 items-center bg-[#924C00] text-left py-2.5 px-3 my-[31px] mx-[158px] rounded-xl border-0" 
												style={{
													boxShadow: "0px 1px 2px #0000000D"
												}}
												onClick={()=>alert("Pressed!")}>
												<span className="text-white text-xs font-bold" >
													+ Stock In
												</span>
											</button>
										</div>
									</div>
									<button className="flex flex-col items-start bg-[#FFEBEE] text-left absolute bottom-[-10px] right-[138px] py-2 px-[13px] rounded-xl border border-solid border-[#C628284D]"
										onClick={()=>alert("Pressed!")}>
										<span className="text-[#C62828] text-xs font-bold" >
											- Stock Out
										</span>
									</button>
								</div>
								<div className="flex items-center self-stretch mb-5 gap-4">
									<div className="flex-1 bg-white pt-5 rounded-xl" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}>
										<div className="flex justify-between items-start self-stretch mx-5">
											<div className="w-[136px]">
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#6F6F6F] text-[10px] font-bold w-[135px]" >
														TODAY&#39;S INTAKE (STOCK\nIN)
													</span>
												</div>
												<div className="flex items-center self-stretch pt-1 gap-[11px]">
													<span className="text-[#2E7D32] text-[26px] font-bold" >
														+92
													</span>
													<span className="text-[#6F6F6F] text-xs" >
														Units
													</span>
												</div>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/xtbinfi3_expires_30_days.png"} 
												className="w-[15px] h-[15px] object-fill"
											/>
										</div>
										<div className="flex items-center self-stretch pt-4 pb-1 mb-4 mx-5">
											<div className="flex flex-1 flex-col items-start mr-8">
												<span className="text-[#6F6F6F] text-[13px] w-[86px]" >
													Across 6 PO\nconsignments
												</span>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/lqw7dlma_expires_30_days.png"} 
												className="w-2.5 h-1.5 mr-[31px] object-fill"
											/>
											<span className="text-[#2E7D32] text-[10px] font-bold w-11" >
												+14% vs\nyest
											</span>
										</div>
										<div className="self-stretch bg-[#2E7D324D] h-1">
										</div>
									</div>
									<div className="flex-1 bg-white pt-5 rounded-xl" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}>
										<div className="flex justify-between items-start self-stretch mb-9 mx-5">
											<div className="w-[147px]">
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#6F6F6F] text-[10px] font-bold" >
														Unit MOVEMENT BALANCE
													</span>
												</div>
												<div className="flex items-center self-stretch pt-1 gap-[11px]">
													<span className="text-[#924C00] text-[26px] font-bold" >
														+46
													</span>
													<span className="text-[#6F6F6F] text-xs" >
														Units Net Gain
													</span>
												</div>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/l65t9d9j_expires_30_days.png"} 
												className="w-4 h-[15px] object-fill"
											/>
										</div>
										<div className="flex items-center self-stretch pt-4 pb-1 mb-4 mx-5 gap-1">
											<div className="flex flex-1 items-center bg-[#F0EDED] rounded-[9999px]">
												<div className="bg-[#2E7D32] w-[74px] h-2">
												</div>
												<div className="bg-[#E98B3A] w-[37px] h-2">
												</div>
											</div>
											<span className="text-[#6F6F6F] text-[10px] font-bold" >
												2.0x Replenish
											</span>
										</div>
										<div className="self-stretch bg-[#E98B3A4D] h-1">
										</div>
									</div>
									<div className="flex-1 bg-white pt-5 rounded-xl" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}>
										<div className="flex justify-between items-start self-stretch mb-[18px] mx-5">
											<div className="flex flex-col items-start w-[119px]">
												<span className="text-[#6F6F6F] text-[10px] font-bold w-[119px]" >
													TODAY&#39;S DISPATCHED\n(STOCK OUT)
												</span>
												<div className="flex items-center self-stretch pt-1 gap-3">
													<span className="text-[#C62828] text-[26px] font-bold" >
														-6
													</span>
													<span className="text-[#6F6F6F] text-xs" >
														Units
													</span>
												</div>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/oc49id0x_expires_30_days.png"} 
												className="w-[15px] h-[15px] object-fill"
											/>
										</div>
										<div className="flex flex-col items-start self-stretch pt-4 mb-4 mx-5">
											<div className="flex flex-col items-center">
												<span className="text-[#6F6F6F] text-[13px]" >
													Unit stock  out
												</span>
											</div>
										</div>
										<div className="self-stretch bg-[#C628284D] h-1">
										</div>
									</div>
								</div>
								<div className="flex flex-col self-stretch bg-white py-[21px] px-5 mb-5 rounded-xl" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<div className="flex justify-between items-start self-stretch pb-3">
										<div className="flex flex-col items-start w-[376px]">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#1B1C1C] text-base font-bold" >
													Quick Operations Desk
												</span>
											</div>
											<span className="text-[#6F6F6F] text-[13px]" >
												Simulate and post rapid counter/bay stock transitions directly
											</span>
										</div>
										<div className="flex shrink-0 items-center bg-[#F6F3F2] p-1 gap-[5px] rounded-lg">
											<button className="flex shrink-0 items-center bg-[#E8F5E9] text-left py-1.5 px-3 gap-1 rounded-lg border-0" 
												style={{
													boxShadow: "0px 1px 2px #0000000D"
												}}
												onClick={()=>alert("Pressed!")}>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/io0qavc8_expires_30_days.png"} 
													className="w-[9px] h-[9px] rounded-lg object-fill"
												/>
												<span className="text-[#2E7D32] text-xs font-bold" >
													+ Inbound Restock
												</span>
											</button>
											<div className="flex shrink-0 items-center py-1.5 px-3 gap-[3px] rounded-lg">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/85xes537_expires_30_days.png"} 
													className="w-[9px] h-[9px] rounded-lg object-fill"
												/>
												<span className="text-[#6F6F6F] text-xs font-bold" >
													- Inbound Outflow
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-start self-stretch">
										<div className="flex flex-col w-[301px] mt-[11px] mr-4 gap-1.5">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#6F6F6F] text-[10px] font-bold" >
													TARGET PART / SKU SELECTION
												</span>
											</div>
											<div className="flex items-center self-stretch bg-[#F6F3F2] p-2 gap-2 rounded-lg">
												<div className="bg-white w-10 h-10 p-3 rounded" 
													style={{
														boxShadow: "0px 1px 2px #0000000D"
													}}>
												</div>
												<div className="flex flex-1 flex-col">
													<span className="text-[#1B1C1C] text-xs font-bold" >
														Shimano Deore M6100 12-Speed Cassette
													</span>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															CST-SHI-6100-12 • Bin G-04
														</span>
													</div>
												</div>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/bahzk0vk_expires_30_days.png"} 
													className="w-2 h-1 rounded-lg object-fill"
												/>
											</div>
										</div>
										<div className="flex flex-col w-[221px] mt-3 mr-[17px] gap-1.5">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#6F6F6F] text-[10px] font-bold" >
													INTAKE / DISPATCH QUANTITY
												</span>
											</div>
											<div className="flex items-center self-stretch">
												<button className="flex flex-col shrink-0 items-start bg-[#F0EDED] text-left py-[9px] px-[11px] mr-1 rounded-lg border-0"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#1B1C1C] text-[13px] font-bold" >
														-5
													</span>
												</button>
												<button className="flex flex-col shrink-0 items-start bg-[#F0EDED] text-left py-[9px] px-3 mr-1 rounded-lg border-0"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#1B1C1C] text-[13px] font-bold" >
														-1
													</span>
												</button>
												<div className="flex flex-col items-center bg-white w-[61px] py-2 mr-[5px] gap-2 rounded-lg">
													<span className="text-[#1B1C1C] text-base font-bold" >
														+15
													</span>
													<div className="flex flex-col items-start self-stretch mx-5">
														<span className="text-[#6F6F6F] text-[10px]" >
															units
														</span>
													</div>
												</div>
												<button className="flex flex-col shrink-0 items-start bg-[#F0EDED] text-left py-[9px] px-[11px] mr-1 rounded-lg border-0"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#1B1C1C] text-[13px] font-bold" >
														+1
													</span>
												</button>
												<button className="flex flex-col shrink-0 items-start bg-[#F0EDED] text-left p-[9px] rounded-lg border-0"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#1B1C1C] text-[13px] font-bold" >
														+5
													</span>
												</button>
											</div>
										</div>
										<div className="flex flex-col w-[221px] mt-[19px] mr-[17px] gap-1.5">
											<div className="flex items-center self-stretch gap-[5px]">
												<span className="text-[#6F6F6F] text-[10px] font-bold" >
													BALANCE TRANSITION
												</span>
												<span className="text-[#2E7D32] text-[10px] font-bold" >
													60% Safe Capacity
												</span>
											</div>
											<button className="flex justify-center items-center self-stretch bg-[#F6F3F2] text-left py-2 rounded-lg border-0"
												onClick={()=>alert("Pressed!")}>
												<span className="text-[#C62828] text-xs font-bold mr-[19px]" >
													3 units (Crit)
												</span>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/298t3bek_expires_30_days.png"} 
													className="w-[11px] h-[5px] mr-[18px] rounded-lg object-fill"
												/>
												<span className="text-[#2E7D32] text-xs font-bold" >
													18 units (Safe)
												</span>
											</button>
											<div className="flex items-center self-stretch bg-[#F0EDED] rounded-[9999px]">
												<div className="bg-[#C62828] w-[22px] h-2">
												</div>
												<div className="bg-[#2E7D32] w-[111px] h-2">
												</div>
											</div>
										</div>
										<div className="flex flex-col w-[142px] mt-[27px]">
											<div className="self-stretch h-3.5">
											</div>
											<button className="flex justify-center items-center self-stretch bg-[#924C00] text-left py-2.5 gap-[3px] rounded-xl border-0" 
												style={{
													boxShadow: "0px 1px 2px #0000000D"
												}}
												onClick={()=>alert("Pressed!")}>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/mcmjxdhp_expires_30_days.png"} 
													className="w-[13px] h-[13px] rounded-xl object-fill"
												/>
												<span className="text-white text-xs font-bold" >
													Save
												</span>
											</button>
										</div>
									</div>
								</div>
								<div className="self-stretch bg-white mb-5 rounded-xl" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<div className="flex flex-col self-stretch bg-white p-3 gap-3">
										<div className="flex items-center self-stretch">
											<div className="flex flex-1 items-start bg-[#FAFAF8] pt-[17px] pb-[3px] px-3.5 gap-2 rounded-lg">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/vvmixrl7_expires_30_days.png"} 
													className="w-[13px] h-[13px] object-fill"
												/>
												<div className="flex flex-1 flex-col items-start">
													<span className="text-[#6F6F6F] text-[13px]" >
														Filter by SKU, part name, reference PO#, or mechanic name...
													</span>
												</div>
											</div>
											<div className="flex flex-1 items-center">
												<div className="flex flex-1 items-center bg-[#FAFAF8] py-2 px-3 mr-2 gap-[17px] rounded-lg">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															All Categories (Braking, Drivetrain, Gears)
														</span>
													</div>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/eetpjyyl_expires_30_days.png"} 
														className="w-[7px] h-1 object-fill"
													/>
												</div>
												<div className="flex shrink-0 items-center bg-[#FAFAF8] p-0.5 mr-[9px] rounded-lg">
													<button className="flex flex-col shrink-0 items-start bg-white text-left py-1.5 px-2 mr-[1px] rounded-lg border-0"
														onClick={()=>alert("Pressed!")}>
														<span className="text-[#1B1C1C] text-[10px] font-bold" >
															Today (Oct 24)
														</span>
													</button>
													<div className="flex flex-col shrink-0 items-start py-1.5 px-2 rounded-lg">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															Weekly
														</span>
													</div>
													<div className="flex flex-col shrink-0 items-start py-1.5 px-2 rounded-lg">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															Monthly
														</span>
													</div>
												</div>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/1g71hgw6_expires_30_days.png"} 
													className="w-[30px] h-[30px] rounded-lg object-fill"
												/>
											</div>
										</div>
										<div className="flex items-center self-stretch pt-1 gap-1">
											<div className="flex flex-col shrink-0 items-start bg-[#E98B3A] py-1 px-3 rounded-[9999px]">
												<span className="text-white text-[10px] font-bold" >
													All Movements (148)
												</span>
											</div>
											<div className="flex shrink-0 items-center bg-[#F6F3F2] py-1 px-3 gap-1 rounded-[9999px]">
												<span className="text-[#2E7D32] text-[10px] font-bold" >
													▲
												</span>
												<span className="text-[#544337] text-[10px] font-bold" >
													Stock In Only (+92)
												</span>
											</div>
											<div className="flex shrink-0 items-center bg-[#F6F3F2] py-1 px-3 gap-[5px] rounded-[9999px]">
												<span className="text-[#C62828] text-[10px] font-bold" >
													▼
												</span>
												<span className="text-[#544337] text-[10px] font-bold" >
													Stock Out Only (-46)
												</span>
											</div>
										</div>
									</div>
									<div className="self-stretch">
										<div className="flex items-center self-stretch bg-[#FAFAF8]">
											<div className="flex flex-col shrink-0 items-start py-5 pl-5 pr-[71px]">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													TIMESTAMP 
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start py-3 pl-3 pr-[23px]">
												<span className="text-[#6F6F6F] text-[11px] font-bold w-[70px]" >
													MOVEMENT\nTYPE
												</span>
											</div>
											<div className="flex flex-1 flex-col items-start py-5 pl-3 mr-[1px]">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													PRODUCT DETAILS &amp; SKU
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start py-5 pl-3 pr-[73px]">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													REFERENCE / REASON
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start py-5 px-3">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													QUANTITY
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start p-3">
												<span className="text-[#6F6F6F] text-[11px] font-bold w-[74px]" >
													STOCK\nTRANSITION
												</span>
											</div>
										</div>
										<div className="flex flex-col self-stretch">
											<div className="flex items-center self-stretch">
												<div className="flex flex-col shrink-0 items-start pr-[25px] ml-5 mr-3">
													<span className="text-[#1B1C1C] text-xs font-bold" >
														Today, 03:45 PM
													</span>
												</div>
												<div className="flex flex-col shrink-0 items-center py-6 pl-5 pr-[52px] mr-3">
													<span className="text-[#2E7D32] text-[10px] font-bold" >
														Stock In
													</span>
												</div>
												<div className="flex items-center w-[287px] mr-[13px] gap-2">
													<div className="bg-[#F0EDED] w-9 h-9 rounded-lg">
													</div>
													<div className="flex-1">
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#1B1C1C] text-xs font-bold" >
																Shimano Deore M6100 12-Speed Cassette
															</span>
														</div>
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#6F6F6F] text-[10px] font-bold" >
																SKU: CST-SHI-6100-12
															</span>
														</div>
													</div>
												</div>
												<div className="w-[201px] pl-3 mr-3">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															Unit Parts Restock
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															PO #TAG-2024-88 (NeoZigma PH)
														</span>
													</div>
												</div>
												<div className="flex flex-col shrink-0 items-start py-[25px] px-[22px] mr-3">
													<span className="text-[#2E7D32] text-xs font-bold" >
														+15 units
													</span>
												</div>
												<div className="flex shrink-0 items-center mr-0.5">
													<span className="text-[#6F6F6F] text-[10px] font-bold mr-[5px]" >
														3
													</span>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/cmfmws7e_expires_30_days.png"} 
														className="w-[9px] h-1 mr-[3px] object-fill"
													/>
													<span className="text-[#1B1C1C] text-[10px] font-bold" >
														18 units
													</span>
												</div>
											</div>
											<div className="flex items-center self-stretch">
												<div className="w-[121px] ml-5 mr-3">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															Today, 02:15 PM
														</span>
													</div>
													<div className="self-stretch h-3.5">
													</div>
												</div>
												<div className="flex flex-col shrink-0 items-start py-6 pl-5 pr-11 mr-3">
													<span className="text-[#C62828] text-[10px] font-bold" >
														Stock Out
													</span>
												</div>
												<div className="flex flex-1 items-center mr-[13px] gap-2">
													<div className="bg-[#F0EDED] w-9 h-9 rounded-lg">
													</div>
													<div className="w-[178px]">
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#1B1C1C] text-xs font-bold" >
																KMC X11 Silver 11-Speed Chain
															</span>
														</div>
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#6F6F6F] text-[10px] font-bold" >
																SKU: CHN-KMC-X11-SLV
															</span>
														</div>
													</div>
												</div>
												<div className="w-[201px] pl-3 mr-3">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															Unit Parts Sales
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															Job Order #RO-TAG-1049
														</span>
													</div>
												</div>
												<div className="flex flex-col shrink-0 items-start py-[25px] pl-[29px] pr-[13px] mr-3">
													<span className="text-[#C62828] text-xs font-bold" >
														-4 units
													</span>
												</div>
												<div className="flex shrink-0 items-center mr-0.5">
													<span className="text-[#6F6F6F] text-[10px] font-bold mr-[5px]" >
														12
													</span>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/3v4g9gjv_expires_30_days.png"} 
														className="w-[9px] h-1 mr-[3px] object-fill"
													/>
													<span className="text-[#1B1C1C] text-[10px] font-bold" >
														8 units
													</span>
												</div>
											</div>
											<div className="flex items-center self-stretch">
												<div className="flex flex-col shrink-0 items-start pr-[29px] ml-5 mr-3">
													<span className="text-[#1B1C1C] text-xs font-bold" >
														Today, 11:30 AM
													</span>
												</div>
												<div className="flex flex-col shrink-0 items-center py-6 pl-5 pr-11 mr-3">
													<span className="text-[#C62828] text-[10px] font-bold" >
														Stock Out
													</span>
												</div>
												<div className="flex items-center w-[287px] mr-[13px] gap-2">
													<div className="bg-[#F0EDED] w-9 h-9 rounded-lg">
													</div>
													<div className="flex-1">
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#1B1C1C] text-xs font-bold" >
																Shimano B01S Resin Disc Brake Pads
															</span>
														</div>
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#6F6F6F] text-[10px] font-bold" >
																SKU: BRK-SHI-B01S-RES
															</span>
														</div>
													</div>
												</div>
												<div className="w-[201px] pl-3 mr-3">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															Unit Parts Sales
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															Invoice #INV-2024-5502
														</span>
													</div>
												</div>
												<div className="flex flex-col shrink-0 items-start py-[25px] pl-[30px] pr-[13px] mr-3">
													<span className="text-[#C62828] text-xs font-bold" >
														-2 units
													</span>
												</div>
												<div className="flex shrink-0 items-center mr-0.5">
													<span className="text-[#6F6F6F] text-[10px] font-bold mr-[5px]" >
														22
													</span>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/j0n18eoz_expires_30_days.png"} 
														className="w-[9px] h-1 mr-[3px] object-fill"
													/>
													<span className="text-[#1B1C1C] text-[10px] font-bold" >
														20 units
													</span>
												</div>
											</div>
											<div className="flex items-center self-stretch">
												<div className="w-[121px] ml-5 mr-3">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															Today, 09:15 AM
														</span>
													</div>
													<div className="self-stretch h-3.5">
													</div>
												</div>
												<div className="flex flex-col shrink-0 items-center py-6 pl-5 pr-[53px] mr-3">
													<span className="text-[#2E7D32] text-[10px] font-bold" >
														Stock In
													</span>
												</div>
												<div className="flex items-center w-[287px] mr-[13px] gap-2">
													<div className="bg-[#F0EDED] w-9 h-9 rounded-lg">
													</div>
													<div className="flex-1">
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#1B1C1C] text-xs font-bold" >
																SRAM GX Eagle 12-Speed Derailleur
															</span>
														</div>
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#6F6F6F] text-[10px] font-bold" >
																SKU: DER-SRM-GX12-LUN
															</span>
														</div>
													</div>
												</div>
												<div className="w-[201px] pl-3 mr-3">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#1B1C1C] text-xs font-bold" >
															Unit Parts Restock
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[10px] font-bold" >
															PO #TAG-2024-91 (Davao Hub)
														</span>
													</div>
												</div>
												<div className="flex flex-col shrink-0 items-start py-[25px] pl-[27px] pr-[13px] mr-3">
													<span className="text-[#2E7D32] text-xs font-bold" >
														+8 units
													</span>
												</div>
												<div className="flex shrink-0 items-center mr-0.5">
													<span className="text-[#6F6F6F] text-[10px] font-bold mr-[5px]" >
														1
													</span>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/wv3p4dku_expires_30_days.png"} 
														className="w-[9px] h-1 mr-[3px] object-fill"
													/>
													<span className="text-[#1B1C1C] text-[10px] font-bold" >
														9 units
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex justify-between items-center self-stretch bg-[#FAFAF8] p-3">
										<span className="text-[#6F6F6F] text-[10px] font-bold" >
											Showing 6 of 10 movement transactions
										</span>
										<div className="flex shrink-0 items-center">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/vpspxysj_expires_30_days.png"} 
												className="w-5 h-[15px] mr-[3px] rounded object-fill"
											/>
											<div className="flex flex-col shrink-0 items-start bg-[#E98B3A] py-1 px-2.5 mr-[5px] rounded">
												<span className="text-white text-[10px] font-bold" >
													1
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start bg-white py-1 px-2.5 mr-1 rounded">
												<span className="text-[#1B1C1C] text-[10px] font-bold" >
													2
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start bg-white py-1 px-2.5 mr-[5px] rounded">
												<span className="text-[#1B1C1C] text-[10px] font-bold" >
													3
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start px-1 mr-[5px]">
												<span className="text-[#6F6F6F] text-[10px] font-bold" >
													...
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start bg-white py-1 px-2.5 mr-1 rounded">
												<span className="text-[#1B1C1C] text-[10px] font-bold" >
													25
												</span>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/ih9s9qmi_expires_30_days.png"} 
												className="w-5 h-[15px] rounded object-fill"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center self-stretch bg-[#F6F3F2] py-2 pl-3 mb-[41px] gap-2 rounded-lg">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/gm3wu11b_expires_30_days.png"} 
										className="w-2.5 h-[13px] object-fill"
									/>
									<span className="text-[#6F6F6F] text-[10px] font-bold" >
										All physical stock entries and dispatches are tamper-resistant logged under Vjay&#39;s Parts Mankilam .
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-start absolute top-3.5 right-[-8px] pr-[63px]">
							<div className="flex items-center">
								<div className="flex shrink-0 items-center bg-white mr-3.5 gap-2 rounded-xl border border-solid border-[#E2DFD9]" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/ega0ofd6_expires_30_days.png"} 
										className="w-7 h-[30px] object-fill"
									/>
									<div className="flex flex-col shrink-0 items-start pr-28">
										<span className="text-slate-400 text-xs" >
											Search parts, SKUs, brand...
										</span>
									</div>
								</div>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/ea3i2jzv_expires_30_days.png"} 
									className="w-[34px] h-[34px] mr-[13px] rounded-xl object-fill"
								/>
								<button className="flex shrink-0 items-center bg-white text-left py-[7px] px-[13px] mr-[15px] gap-[5px] rounded-xl border border-solid border-[#E2DFD9]" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}
									onClick={()=>alert("Pressed!")}>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/lonjuhqp_expires_30_days.png"} 
										className="w-4 h-4 rounded-xl object-fill"
									/>
									<span className="text-slate-700 text-xs font-bold" >
										Oct 24, 2024
									</span>
								</button>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/2m580zv8_expires_30_days.png"} 
									className="w-[66px] h-[30px] mr-3.5 rounded-xl object-fill"
								/>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/yxe80knq_expires_30_days.png"} 
									className="w-[34px] h-[34px] rounded-xl object-fill"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}