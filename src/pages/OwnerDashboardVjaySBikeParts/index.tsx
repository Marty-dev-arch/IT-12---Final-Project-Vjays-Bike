import React, {useState} from "react";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white overflow-hidden">
				<div className="items-start self-stretch">
					<div className="bg-white w-64 pb-[671px]" 
						style={{
							boxShadow: "0px 1px 8px #00000008"
						}}>
						<div className="self-stretch py-[18px]">
							<div className="flex items-center self-stretch mb-[21px] mx-6 gap-3">
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/8b894ce8_expires_30_days.png"} 
									className="w-[55px] h-[55px] rounded-xl object-fill"
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
							<div className="flex flex-col self-stretch py-4 mb-[182px] gap-1">
								<div className="flex items-center self-stretch bg-orange-50 mx-4 rounded-lg border border-solid border-orange-200">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/2zg0jfit_expires_30_days.png"} 
										className="w-5 h-5 mx-3 rounded-lg object-fill"
									/>
									<input
										placeholder="Dashboard"
										value={input1}
										onChange={(event)=>onChangeInput1(event.target.value)}
										className="flex-1 self-stretch text-orange-700 bg-transparent text-sm py-2.5 mr-1 border-0"
									/>
								</div>
								<div className="flex flex-col self-stretch pt-2 mx-4 gap-1">
									<div className="flex justify-between items-center self-stretch py-2.5 px-3 rounded-xl" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}>
										<div className="flex shrink-0 items-center gap-3">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/971h6yv5_expires_30_days.png"} 
												className="w-5 h-5 object-fill"
											/>
											<span className="text-slate-600 text-sm font-bold" >
												Products 
											</span>
										</div>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/icf3xpax_expires_30_days.png"} 
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
											<span className="text-slate-700 text-xs" >
												Braking System
											</span>
											<div className="flex flex-col shrink-0 items-start bg-red-500 py-0.5 px-1.5 rounded-[9999px]">
												<span className="text-white text-[10px] font-bold" >
													2
												</span>
											</div>
										</div>
										<div className="flex justify-between items-center self-stretch py-1.5">
											<span className="text-slate-700 text-xs" >
												Drivetrain &amp; Chains
											</span>
											<div className="flex flex-col shrink-0 items-start bg-red-500 py-0.5 px-1.5 rounded-[9999px]">
												<span className="text-white text-[10px] font-bold" >
													1
												</span>
											</div>
										</div>
										<div className="flex flex-col items-center self-stretch py-1.5">
											<span className="text-slate-700 text-xs" >
												Gears &amp; Sprockets
											</span>
										</div>
									</div>
								</div>
								<div className="flex flex-col items-start self-stretch py-[9px] ml-4">
									<span className="text-slate-400 text-[10px] font-bold mb-3.5 ml-3" >
										OPERATIONS
									</span>
									<div className="flex items-center mb-2.5 ml-3 gap-3">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/umqezk5e_expires_30_days.png"} 
											className="w-5 h-5 object-fill"
										/>
										<span className="text-slate-600 text-sm" >
											Stock Movement
										</span>
									</div>
									<div className="flex justify-between items-center self-stretch py-2.5 px-3 rounded-lg">
										<div className="flex shrink-0 items-center gap-3">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/dttin7z9_expires_30_days.png"} 
												className="w-5 h-5 object-fill"
											/>
											<span className="text-slate-600 text-sm" >
												Logs History
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start bg-rose-50 py-[1px] px-[7px] rounded border border-solid border-rose-200">
											<span className="text-rose-600 text-[10px] font-bold" >
												New
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center self-stretch py-2.5 pl-3 mx-4 rounded-xl" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}>
								<span className="text-slate-600 text-sm font-bold" >
									Need Help?
								</span>
							</div>
						</div>
					</div>
					<div className="self-stretch bg-[#FAFAF8] ml-[255px]">
						<div className="flex flex-col items-end self-stretch bg-[#FAFAF8E3] py-[15px] pl-6 pr-[57px] mx-[1px]">
							<div className="flex items-center">
								<div className="flex shrink-0 items-center bg-white mr-3.5 gap-2 rounded-xl border border-solid border-[#E2DFD9]" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/u4akykcz_expires_30_days.png"} 
										className="w-7 h-[30px] object-fill"
									/>
									<div className="flex flex-col shrink-0 items-start pr-10">
										<span className="text-slate-400 text-xs" >
											Search parts, SKUs, brand, bin... (Ctrl+K)
										</span>
									</div>
								</div>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/g33o57oy_expires_30_days.png"} 
									className="w-[34px] h-[34px] mr-[13px] rounded-xl object-fill"
								/>
								<button className="flex shrink-0 items-center bg-white text-left py-[7px] px-[13px] mr-[15px] gap-[5px] rounded-xl border border-solid border-[#E2DFD9]" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}
									onClick={()=>alert("Pressed!")}>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/92o46dxr_expires_30_days.png"} 
										className="w-4 h-4 rounded-xl object-fill"
									/>
									<span className="text-slate-700 text-xs font-bold" >
										Oct 24, 2024
									</span>
								</button>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/atth379t_expires_30_days.png"} 
									className="w-[66px] h-[30px] mr-3.5 rounded-xl object-fill"
								/>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/mba2parp_expires_30_days.png"} 
									className="w-[33px] h-[34px] rounded-xl object-fill"
								/>
							</div>
						</div>
						<div className="items-start self-stretch relative mx-6">
							<div className="flex flex-col self-stretch pb-[1px] gap-5">
								<div className="flex justify-between items-center self-stretch bg-white relative py-1 px-[25px] ml-[1px] mr-3.5 rounded-2xl border border-solid border-[#E8E3DD]">
									<div className="self-stretch bg-[#E98B3A1A] w-[193px] absolute top-0 bottom-0 right-0 rounded-[9999px] blur-[64px]">
									</div>
									<div className="flex flex-col w-[308px] gap-[3px]">
										<div className="flex flex-col items-start self-stretch">
											<span className="text-neutral-900 text-3xl font-bold" >
												Good morning, Vjay
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch">
											<span className="text-neutral-600 text-sm" >
												Here&#39;s your inventory overview for today.
											</span>
										</div>
										<div className="self-stretch h-[29px]">
										</div>
									</div>
									<div className="flex items-start bg-[#FAFAF8] w-[257px] px-[17px] rounded-xl border border-solid border-[#E8E3DD]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/va5syukw_expires_30_days.png"} 
											className="w-[19px] h-[18px] mt-[51px] mr-[15px] rounded-xl object-fill"
										/>
										<div className="flex flex-col items-start w-[90px] my-5">
											<span className="text-neutral-500 text-[10px] font-bold mb-[1px]" >
												STOCK VALUATION
											</span>
											<div className="flex flex-col items-start self-stretch mb-0.5">
												<span className="text-neutral-900 text-2xl font-bold" >
													₱486,250.00
												</span>
											</div>
											<span className="text-[#6F6F6F] text-[10px]" >
												Cost-basis Stock Prices Evaluation
											</span>
										</div>
										<div className="flex-1 self-stretch">
										</div>
										<div className="flex shrink-0 items-center mt-[37px] gap-[1px]">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/k554kvtv_expires_30_days.png"} 
												className="w-5 h-3 object-fill"
											/>
											<span className="text-[#2E7D32] text-[11px] font-bold" >
												+3.2%
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center self-stretch mx-[1px] gap-4">
									<div className="flex-1 bg-white py-5 px-[21px] rounded-2xl border border-solid border-[#E8E3DD]">
										<div className="flex justify-between items-center self-stretch pb-3 mb-1.5">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												CATALOG BREADTH
											</span>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/kvxpam5y_expires_30_days.png"} 
												className="w-5 h-5 object-fill"
											/>
										</div>
										<div className="flex flex-col items-start self-stretch mb-[5px]">
											<span className="text-neutral-900 text-3xl font-bold" >
												128
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch mb-1.5">
											<span className="text-neutral-600 text-xs" >
												Active SKUs cataloged
											</span>
										</div>
										<div className="flex items-start self-stretch pt-[25px] gap-[5px]">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/ljh9br73_expires_30_days.png"} 
												className="w-5 h-3 object-fill"
											/>
											<span className="text-[#2E7D32] text-xs font-bold" >
												+6 new this month
											</span>
										</div>
									</div>
									<div className="flex-1 bg-white p-[21px] rounded-2xl border border-solid border-[#E8E3DD]">
										<div className="flex items-center self-stretch pb-3 mb-[19px] gap-[33px]">
											<div className="flex flex-1 flex-col items-start">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													PHYSICAL STOCK VOLUME
												</span>
											</div>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/p0p4ip8a_expires_30_days.png"} 
												className="w-[18px] h-[19px] object-fill"
											/>
										</div>
										<div className="flex flex-col self-stretch mb-5 gap-[3px]">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-neutral-900 text-3xl font-bold" >
													150
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch">
												<span className="text-neutral-600 text-xs" >
													Total units across all strorage
												</span>
											</div>
										</div>
										<div className="items-start self-stretch bg-neutral-100 mt-3 rounded-[9999px]">
											<div className="bg-[#E98B3A] w-[147px] h-1.5 rounded-[9999px]">
											</div>
										</div>
									</div>
									<div className="flex-1 bg-white py-5 px-[21px] rounded-2xl border border-solid border-[#E8E3DD]">
										<div className="flex justify-between items-center self-stretch pb-3">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												INFLOW TODAY
											</span>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/ucc9nd9e_expires_30_days.png"} 
												className="w-[18px] h-[18px] object-fill"
											/>
										</div>
										<div className="flex flex-col self-stretch gap-[3px]">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#2E7D32] text-3xl font-bold" >
													+74
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch">
												<span className="text-neutral-600 text-xs" >
													Units received &amp; slotted
												</span>
											</div>
										</div>
										<div className="flex items-start self-stretch pt-[25px] gap-[5px]">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/4ge5vnqy_expires_30_days.png"} 
												className="w-[19px] h-5 object-fill"
											/>
											<div className="flex flex-1 flex-col items-start">
												<span className="text-[#6F6F6F] text-[11px] w-28" >
													Workshop restock\nverified on floor
												</span>
											</div>
										</div>
									</div>
									<div className="flex-1 bg-white py-5 px-[21px] rounded-2xl border border-solid border-[#E8E3DD]">
										<div className="flex justify-between items-center self-stretch pb-3">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												DISPATCHED TODAY
											</span>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/bw3dp1yc_expires_30_days.png"} 
												className="w-[18px] h-[18px] object-fill"
											/>
										</div>
										<div className="flex flex-col self-stretch gap-[3px]">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#924C00] text-3xl font-bold" >
													-32
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch">
												<span className="text-neutral-600 text-xs" >
													Units outbound to repairs
												</span>
											</div>
										</div>
										<div className="flex items-start self-stretch pt-[25px] gap-[5px]">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/3dt150yu_expires_30_days.png"} 
												className="w-5 h-5 object-fill"
											/>
											<div className="flex flex-1 flex-col items-start">
												<span className="text-[#6F6F6F] text-[11px] w-[118px]" >
													14 workshop repair\ntickets
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col self-stretch pb-[89px] gap-5">
									<div className="self-stretch relative">
										<div className="flex items-center self-stretch pb-96 px-[1px] gap-4">
											<div className="flex flex-1 flex-col bg-white p-[21px] gap-[38px] rounded-2xl border border-solid border-[#E8E3DD]">
												<div className="flex items-start self-stretch pb-2 gap-10">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#6F6F6F] text-[10px] font-bold mb-[3px]" >
															THIS WEEK AT MANKILAM
														</span>
														<div className="flex flex-col items-start self-stretch mb-1">
															<span className="text-neutral-900 text-lg font-bold" >
																Operation Active
															</span>
														</div>
														<div className="flex flex-col items-start self-stretch">
															<span className="text-[#6F6F6F] text-xs" >
																Scheduled Restocking: Tue &amp; Thu
															</span>
														</div>
													</div>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/i1ja6vl8_expires_30_days.png"} 
														className="w-4 h-4 object-fill"
													/>
												</div>
												<div className="flex items-center self-stretch">
													<div className="flex flex-col items-center bg-[#FAFAF8] w-10 py-2 mr-1.5 rounded-xl border border-solid border-[#E8E3DD]">
														<div className="flex flex-col items-center pb-[3px]">
															<span className="text-neutral-500 text-[9px]" >
																MON
															</span>
														</div>
														<span className="text-neutral-800 text-xs font-bold" >
															12
														</span>
													</div>
													<div className="flex flex-col items-center bg-[#E98B3A] w-10 py-2 mr-1.5 rounded-xl">
														<div className="flex flex-col items-center pb-[3px]">
															<span className="text-white text-[9px]" >
																TUE
															</span>
														</div>
														<span className="text-white text-xs font-bold" >
															13
														</span>
													</div>
													<div className="flex flex-col items-center bg-[#FAFAF8] w-10 py-2 mr-1.5 rounded-xl border border-solid border-[#E8E3DD]">
														<div className="flex flex-col items-center pb-[3px]">
															<span className="text-neutral-500 text-[9px]" >
																WED
															</span>
														</div>
														<span className="text-neutral-800 text-xs font-bold" >
															14
														</span>
													</div>
													<div className="flex flex-col items-center bg-[#E98B3A] w-10 py-2 mr-[7px] rounded-xl">
														<div className="flex flex-col items-center pb-[3px]">
															<span className="text-white text-[9px]" >
																THU
															</span>
														</div>
														<span className="text-white text-xs font-bold" >
															15
														</span>
													</div>
													<div className="flex flex-col items-center bg-[#FAFAF8] w-10 py-2 mr-1.5 rounded-xl border border-solid border-[#E8E3DD]">
														<div className="flex flex-col items-center pb-[3px]">
															<span className="text-neutral-500 text-[9px]" >
																FRI
															</span>
														</div>
														<span className="text-neutral-800 text-xs font-bold" >
															16
														</span>
													</div>
													<div className="flex flex-col items-center bg-[#FAFAF8] w-10 py-2 rounded-xl border border-solid border-[#E8E3DD]">
														<div className="flex flex-col items-center pb-[3px]">
															<span className="text-neutral-500 text-[9px]" >
																SAT
															</span>
														</div>
														<span className="text-neutral-800 text-xs font-bold" >
															17
														</span>
													</div>
												</div>
											</div>
											<div className="flex flex-1 flex-col items-center bg-white py-5 gap-2 rounded-2xl border border-solid border-[#E8E3DD]">
												<div className="flex items-start self-stretch mx-[21px] gap-5">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#6F6F6F] text-[10px] font-bold mb-1" >
															ESTIMATED STOCK VELOCITY
														</span>
														<div className="flex items-center self-stretch mb-[3px] gap-[11px]">
															<span className="text-neutral-900 text-2xl font-bold" >
																4.8 Days
															</span>
															<span className="text-[#2E7D32] text-[10px] font-bold" >
																Fast Turnover
															</span>
														</div>
														<div className="flex flex-col self-stretch">
															<span className="text-[#6F6F6F] text-xs" >
																Shelf turnaround for tubeless sealant,\nchains &amp; pads
															</span>
														</div>
													</div>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/33r12v8h_expires_30_days.png"} 
														className="w-5 h-3 object-fill"
													/>
												</div>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/8horeq8e_expires_30_days.png"} 
													className="w-[271px] h-16 rounded-2xl object-fill"
												/>
											</div>
										</div>
										<div className="self-stretch bg-white absolute bottom-[-19px] right-0 left-0 p-[1px] rounded-2xl border border-solid border-[#E8E3DD]">
											<div className="self-stretch bg-[#FAFAF8]">
												<div className="flex flex-col items-start self-stretch bg-cover bg-center py-3.5 pr-[65px] gap-[3px]">
													<div className="flex flex-col items-start self-stretch relative ml-[45px]">
														<div className="flex flex-col items-center self-stretch absolute top-3 right-0 left-0">
															<div className="bg-[#FDAD6333] w-72 h-40 rounded-[9999px] blur-[64px]">
															</div>
														</div>
														<button className="flex flex-col items-start bg-[#FAFAF8] text-left absolute top-[-4px] right-[-45px] py-[3px] px-[13px] rounded-[9999px] border border-solid border-[#E8E3DD]"
															onClick={()=>alert("Pressed!")}>
															<div className="flex items-center">
																<span className="text-neutral-600 text-[11px] mr-[11px]" >
																	Daily
																</span>
																<div className="flex flex-col shrink-0 items-start bg-white py-1 px-[11px] mr-2.5 rounded-[9999px] border border-solid border-[#E8E3DD]">
																	<span className="text-[#924C00] text-[11px] font-bold" >
																		Weekly
																	</span>
																</div>
																<span className="text-neutral-600 text-[11px]" >
																	Monthly
																</span>
															</div>
														</button>
														<div className="flex flex-col items-start self-stretch">
															<div className="flex items-center gap-[9px]">
																<span className="text-neutral-800 text-xs font-bold" >
																	+15,2%
																</span>
																<span className="text-neutral-800 text-xs font-bold" >
																	+18,7%
																</span>
															</div>
															<div className="flex items-start self-stretch pt-6 ml-[19px]">
																<div className="flex flex-col items-center w-[53px] py-[45px] mr-[13px] gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[38px] mx-[18px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="bg-[#D4D4D4CC] w-[18px] h-[18px] rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col items-center w-[53px] py-[35px] mr-3 gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[52px] mx-[18px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="bg-[#D4D4D4CC] w-[18px] h-6 rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col w-[53px] py-[23px] px-[18px] mr-[13px] gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[68px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="self-stretch bg-[#D4D4D4CC] h-8 rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col w-[53px] py-[11px] px-[18px] mr-3 gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[84px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="self-stretch bg-[#D4D4D4CC] h-10 rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col w-[53px] pb-[1px] px-[18px] mr-[13px] gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[99px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="self-stretch bg-[#D4D4D4CC] h-[46px] rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col w-[53px] py-[19px] px-[18px] mr-3 gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[74px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="self-stretch bg-[#D4D4D4CC] h-[34px] rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col items-center w-[53px] py-10 mr-[13px] gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-[46px] mx-[18px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="bg-[#D4D4D4CC] w-[18px] h-5 rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
																<div className="flex flex-col items-center w-[53px] py-[50px] gap-1.5">
																	<div className="self-stretch bg-[#E98B3A] h-8 mx-[18px] rounded-tl-sm rounded-tr-sm">
																	</div>
																	<div className="bg-[#D4D4D4CC] w-[18px] h-3.5 rounded-br-sm rounded-bl-sm">
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="flex items-center py-[1px] px-[5px] ml-[49px] gap-1.5">
														<div className="flex shrink-0 items-center bg-white py-[3px] px-[9px] gap-1.5 rounded-[9999px] border border-solid border-[#E8E3DD]">
															<div className="bg-[#E98B3A] w-2 h-2 rounded-[9999px]">
															</div>
															<span className="text-neutral-700 text-[10px] font-bold" >
																Stock In
															</span>
														</div>
														<div className="flex shrink-0 items-center bg-white py-[3px] px-[9px] gap-1.5 rounded-[9999px] border border-solid border-[#E8E3DD]">
															<div className="bg-neutral-300 w-2 h-2 rounded-[9999px]">
															</div>
															<span className="text-neutral-700 text-[10px] font-bold" >
																Stock out
															</span>
														</div>
													</div>
												</div>
											</div>
											<div className="flex items-center self-stretch bg-white p-6 gap-[9px]">
												<div className="flex flex-1 flex-col gap-[3px]">
													<div className="flex flex-col items-center self-stretch">
														<span className="text-[#924C00] text-[11px] font-bold" >
															BALANCE &amp; FLOW
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-neutral-900 text-xl font-bold" >
															Stock In &amp; Stock Out Balance
														</span>
													</div>
													<div className="flex flex-col self-stretch">
														<span className="text-[#6F6F6F] text-xs" >
															Weekly stock in and stock out rhythm (+18.7%) and workshop stock out (-15.2%) in Makilam
														</span>
													</div>
												</div>
												<div className="flex items-center w-[118px] gap-3">
													<div className="flex-1">
														<div className="self-stretch h-[30px]">
														</div>
														<div className="flex flex-col items-start self-stretch">
															<span className="text-neutral-900 text-lg font-bold text-right w-[86px]" >
																+42\nUnits/Day
															</span>
														</div>
													</div>
													<img
														src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/416dsaei_expires_30_days.png"} 
														className="w-5 h-[18px] object-fill"
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="self-stretch bg-white pt-[1px] px-[1px] rounded-2xl border border-solid border-[#E8E3DD]">
										<div className="flex justify-between items-center self-stretch p-6">
											<div className="flex flex-col shrink-0 items-start pt-1.5 gap-0.5">
												<span className="text-[#924C00] text-[11px] font-bold mr-36" >
													AUDIT FEED
												</span>
												<span className="text-neutral-900 text-xl font-bold" >
													Recent Stock Movements
												</span>
											</div>
											<div className="flex shrink-0 items-center gap-[5px]">
												<span className="text-[#924C00] text-xs font-bold" >
													View Full Ledger
												</span>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/x96b7yvj_expires_30_days.png"} 
													className="w-4 h-4 object-fill"
												/>
											</div>
										</div>
										<div className="self-stretch pb-[1px]">
											<div className="flex items-center self-stretch bg-[#FAFAF8] px-[54px]">
												<div className="flex flex-1 flex-col items-start py-[19px] pl-5">
													<span className="text-neutral-500 text-[11px] font-bold" >
														COMPONENT &amp; SKU
													</span>
												</div>
												<div className="flex flex-col shrink-0 items-start py-[19px] pl-4 pr-[27px] mr-[1px]">
													<span className="text-neutral-500 text-[11px] font-bold" >
														MOVEMENT
													</span>
												</div>
												<div className="flex flex-col shrink-0 items-start py-[19px] pl-4 pr-[66px]">
													<span className="text-neutral-500 text-[11px] font-bold" >
														TIMESTAMP
													</span>
												</div>
											</div>
											<div className="self-stretch">
												<div className="flex justify-end items-center self-stretch">
													<div className="flex items-center w-[265px] gap-[11px]">
														<img
															src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/xtaseapo_expires_30_days.png"} 
															className="w-[46px] h-[63px] rounded-lg object-fill"
														/>
														<div className="flex-1">
															<div className="flex flex-col items-start self-stretch">
																<span className="text-neutral-900 text-xs font-bold" >
																	Shimano HG-54 10-Speed Chain
																</span>
															</div>
															<div className="flex flex-col items-start self-stretch">
																<span className="text-[#6F6F6F] text-[11px]" >
																	SKU: CHN-SHI-10HG
																</span>
															</div>
														</div>
													</div>
													<div className="flex flex-col shrink-0 items-start py-3.5 pl-9 pr-[63px] mr-[1px]">
														<span className="text-[#2E7D32] text-[11px] font-bold w-[19px]" >
															+25\nIn
														</span>
													</div>
													<div className="flex flex-col shrink-0 items-start py-[22px] px-4 mr-12">
														<span className="text-[#6F6F6F] text-xs" >
															Today, 04:12 PM
														</span>
													</div>
												</div>
												<div className="flex justify-end items-start self-stretch">
													<div className="flex items-center w-[265px] mt-[13px] gap-[11px]">
														<img
															src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/27vmuz7k_expires_30_days.png"} 
															className="w-14 h-[52px] rounded-lg object-fill"
														/>
														<div className="flex-1">
															<div className="flex flex-col items-start self-stretch">
																<span className="text-neutral-900 text-xs font-bold" >
																	KMC X11 Silver 11-Speed Chain
																</span>
															</div>
															<div className="flex flex-col items-start self-stretch">
																<span className="text-[#6F6F6F] text-[11px]" >
																	SKU: CHN-KMC-X11
																</span>
															</div>
														</div>
													</div>
													<div className="flex flex-col shrink-0 items-start pt-[19px] pl-9 pr-[63px] mt-[5px] mr-[1px]">
														<span className="text-[#C62828] text-[11px] font-bold w-[19px] mb-[7px]" >
															-3\nOut
														</span>
													</div>
													<div className="flex flex-col shrink-0 items-start pt-[31px] px-4 mt-[1px] mr-12">
														<span className="text-[#6F6F6F] text-xs mb-[15px]" >
															Today, 02:45 PM
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col w-[316px] absolute bottom-[148px] right-[-12px] gap-5">
								<div className="flex flex-col self-stretch bg-white p-[21px] mx-[1px] gap-[11px] rounded-2xl border border-solid border-[#E8E3DD]">
									<div className="flex flex-col items-start self-stretch">
										<span className="text-[#6F6F6F] text-[11px] font-bold" >
											DIRECT FLOOR OPERATIONS
										</span>
									</div>
									<div className="flex items-center self-stretch gap-3">
										<button className="flex shrink-0 items-center bg-[#E98B3A] text-left py-[13px] px-7 gap-[7px] rounded-xl border-0" 
											style={{
												boxShadow: "0px 1px 2px #0000000D"
											}}
											onClick={()=>alert("Pressed!")}>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/5sy8sif2_expires_30_days.png"} 
												className="w-5 h-5 rounded-xl object-fill"
											/>
											<span className="text-white text-xs font-bold" >
												Stock In
											</span>
										</button>
										<button className="flex shrink-0 items-center bg-[#FAFAF8] text-left py-[13px] px-[23px] gap-[7px] rounded-xl border border-solid border-[#E8E3DD]"
											onClick={()=>alert("Pressed!")}>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/hksljgzr_expires_30_days.png"} 
												className="w-5 h-5 rounded-xl object-fill"
											/>
											<span className="text-neutral-900 text-xs font-bold" >
												Stock Out
											</span>
										</button>
									</div>
								</div>
								<div className="flex flex-col self-stretch bg-white py-[25px] gap-4 rounded-2xl border border-solid border-[#E8E3DD]">
									<div className="flex items-center self-stretch bg-[#FFF8E1] p-[15px] mx-[26px] gap-[11px] rounded-xl border border-solid border-[#E6510033]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/0ofbp7pm_expires_30_days.png"} 
											className="w-8 h-8 rounded-[9999px] object-fill"
										/>
										<div className="flex-1">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#E65100] text-xs font-bold" >
													4 Items Require Restocking
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch">
												<span className="text-neutral-600 text-[11px]" >
													Fallen below safety buffer thresholds
												</span>
											</div>
										</div>
									</div>
									<div className="flex justify-between items-center self-stretch mx-[26px]">
										<span className="text-neutral-900 text-lg font-bold" >
											Restock Queue
										</span>
										<span className="text-[#924C00] text-xs font-bold" >
											View All (4)
										</span>
									</div>
									<div className="flex flex-col self-stretch mx-[25px] gap-3">
										<div className="flex flex-col self-stretch bg-[#FAFAF8] p-[15px] mx-[1px] gap-2 rounded-xl border border-solid border-[#E8E3DD]">
											<div className="flex items-center self-stretch gap-[29px]">
												<div className="flex-1">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-neutral-900 text-xs font-bold" >
															Shimano Disc Rotor 160mm RT-56
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[11px]" >
															Bike Parts • Rack B-04
														</span>
													</div>
												</div>
												<span className="text-[#C62828] text-[10px] font-bold" >
													CRITICAL
												</span>
											</div>
											<div className="flex items-center self-stretch py-1 gap-[31px]">
												<div className="flex flex-1 items-center gap-1.5">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#C62828] text-xs font-bold" >
															4 in stock
														</span>
													</div>
													<span className="text-[#6F6F6F] text-[11px]" >
														/ Min 15
													</span>
												</div>
												<button className="flex flex-col shrink-0 items-center bg-white text-left py-1 px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#924C00] text-[11px] font-bold" >
														+ Intake
													</span>
												</button>
											</div>
											<div className="items-start self-stretch bg-neutral-200 rounded-[9999px]">
												<div className="bg-[#C62828] w-[61px] h-1.5 rounded-[9999px]">
												</div>
											</div>
										</div>
										<div className="flex flex-col self-stretch bg-[#FAFAF8] p-[15px] mx-[1px] gap-2 rounded-xl border border-solid border-[#E8E3DD]">
											<div className="flex items-center self-stretch gap-[33px]">
												<div className="flex-1">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-neutral-900 text-xs font-bold" >
															Semi-Metallic Disc Brake Pads B01S
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[11px]" >
															Bike Parts • Rack A-12
														</span>
													</div>
												</div>
												<span className="text-[#E65100] text-[10px] font-bold" >
													LOW STOCK
												</span>
											</div>
											<div className="flex items-center self-stretch py-1 gap-[31px]">
												<div className="flex flex-1 items-center gap-1.5">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#E65100] text-xs font-bold" >
															8 in stock
														</span>
													</div>
													<span className="text-[#6F6F6F] text-[11px]" >
														/ Min 10
													</span>
												</div>
												<button className="flex flex-col shrink-0 items-center bg-white text-left py-1 px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-neutral-600 text-[11px] font-bold" >
														+ Intake
													</span>
												</button>
											</div>
											<div className="items-start self-stretch bg-neutral-200 rounded-[9999px]">
												<div className="bg-[#E98B3A] w-[188px] h-1.5 rounded-[9999px]">
												</div>
											</div>
										</div>
										<div className="flex flex-col self-stretch bg-[#FAFAF8] p-[15px] mx-[1px] gap-2 rounded-xl border border-solid border-[#E8E3DD]">
											<div className="flex items-center self-stretch gap-[29px]">
												<div className="flex-1">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-neutral-900 text-xs font-bold" >
															Front Bike Light 800lm USB-C
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[11px] w-[132px]" >
															Riding Accessories •\nBin C-02
														</span>
													</div>
												</div>
												<span className="text-[#E65100] text-[10px] font-bold" >
													LOW STOCK
												</span>
											</div>
											<div className="flex items-center self-stretch py-1 gap-[31px]">
												<div className="flex flex-1 items-center gap-1.5">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#E65100] text-xs font-bold" >
															5 in stock
														</span>
													</div>
													<span className="text-[#6F6F6F] text-[11px]" >
														/ Min 12
													</span>
												</div>
												<button className="flex flex-col shrink-0 items-center bg-white text-left py-1 px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-neutral-600 text-[11px] font-bold" >
														+ Intake
													</span>
												</button>
											</div>
											<div className="items-start self-stretch bg-neutral-200 rounded-[9999px]">
												<div className="bg-[#E98B3A] w-24 h-1.5 rounded-[9999px]">
												</div>
											</div>
										</div>
										<div className="flex flex-col self-stretch bg-[#FAFAF8] py-[15px] gap-2 rounded-xl border border-solid border-[#E8E3DD]">
											<div className="flex items-center self-stretch mx-4 gap-[34px]">
												<div className="flex-1">
													<div className="flex flex-col items-start self-stretch">
														<span className="text-neutral-900 text-xs font-bold" >
															Kenda 29x2.10 Presta Valve Tube
														</span>
													</div>
													<div className="flex flex-col items-start self-stretch">
														<span className="text-[#6F6F6F] text-[11px]" >
															Bike Parts • Bin A-01
														</span>
													</div>
												</div>
												<span className="text-[#E65100] text-[10px] font-bold" >
													LOW STOCK
												</span>
											</div>
											<div className="flex items-center self-stretch py-1 mx-[15px] gap-8">
												<div className="flex flex-1 items-center gap-[7px]">
													<div className="flex flex-1 flex-col items-start">
														<span className="text-[#E65100] text-xs font-bold" >
															6 in stock
														</span>
													</div>
													<span className="text-[#6F6F6F] text-[11px]" >
														/ Min 20
													</span>
												</div>
												<button className="flex flex-col shrink-0 items-center bg-white text-left py-1 px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-neutral-600 text-[11px] font-bold" >
														+ Intake
													</span>
												</button>
											</div>
											<div className="items-start self-stretch bg-neutral-200 mx-[15px] rounded-[9999px]">
												<div className="bg-[#E98B3A] w-[70px] h-1.5 rounded-[9999px]">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}