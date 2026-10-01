import React from "react";
export default (props) => {
	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-white pl-64 overflow-hidden">
				<div className="flex flex-col items-start self-stretch relative">
					<div className="self-stretch bg-[#FAFAF8] pb-[77px]">
						<div className="flex flex-col items-end self-stretch bg-white py-[15px] pl-7 pr-[123px]" 
							style={{
								boxShadow: "0px 1px 8px #00000008"
							}}>
							<div className="flex items-center">
								<div className="flex shrink-0 items-center bg-white mr-3.5 gap-2 rounded-xl border border-solid border-[#E2DFD9]" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/iu4w0x9h_expires_30_days.png"} 
										className="w-7 h-[30px] object-fill"
									/>
									<div className="flex flex-col shrink-0 items-start pr-10">
										<span className="text-slate-400 text-xs" >
											Search parts, SKUs, brand, bin... (Ctrl+K)
										</span>
									</div>
								</div>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/d1pzt6pj_expires_30_days.png"} 
									className="w-[34px] h-[34px] mr-[13px] rounded-xl object-fill"
								/>
								<button className="flex shrink-0 items-center bg-white text-left py-[7px] px-[13px] mr-[15px] gap-[5px] rounded-xl border border-solid border-[#E2DFD9]" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}
									onClick={()=>alert("Pressed!")}>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/99y7ytu2_expires_30_days.png"} 
										className="w-4 h-4 rounded-xl object-fill"
									/>
									<span className="text-slate-700 text-xs font-bold" >
										Oct 24, 2024
									</span>
								</button>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/6wgtko5w_expires_30_days.png"} 
									className="w-[66px] h-[30px] mr-3.5 rounded-xl object-fill"
								/>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/y094aexs_expires_30_days.png"} 
									className="w-[33px] h-[34px] rounded-xl object-fill"
								/>
							</div>
						</div>
						<div className="flex flex-col items-start self-stretch pb-5 mx-7 gap-5">
							<div className="flex flex-col w-[155px] gap-1">
								<div className="flex items-center self-stretch gap-1">
									<span className="text-[#6F6F6F] text-xs" >
										Products
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/fqia6g3j_expires_30_days.png"} 
										className="w-1 h-[7px] object-fill"
									/>
									<div className="flex flex-1 flex-col items-start">
										<span className="text-[#1B1C1C] text-xs font-bold" >
											Braking System
										</span>
									</div>
								</div>
								<div className="flex flex-col items-start self-stretch pt-0.5">
									<span className="text-[#1B1C1C] text-2xl font-bold" >
										Braking System
									</span>
								</div>
								<div className="self-stretch h-[18px]">
								</div>
							</div>
							<button className="flex items-center bg-[#924C00] text-left py-2 px-5 gap-1 rounded-xl border-0" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}
								onClick={()=>alert("Pressed!")}>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/9r4yjc5g_expires_30_days.png"} 
									className="w-[15px] h-[15px] rounded-xl object-fill"
								/>
								<span className="text-white text-xs font-bold" >
									Add Braking Part
								</span>
							</button>
							<div className="flex items-center self-stretch">
								<div className="w-56 ml-3 mr-7">
									<div className="flex justify-between items-start self-stretch">
										<div className="flex flex-col w-32 gap-1">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													TOTAL BRAKING SKUS
												</span>
											</div>
											<div className="flex items-center self-stretch gap-1.5">
												<span className="text-[#1B1C1C] text-[26px] font-bold" >
													42
												</span>
												<span className="text-[#6F6F6F] text-[10px] font-bold" >
													active lines
												</span>
											</div>
										</div>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/72f29in5_expires_30_days.png"} 
											className="w-[22px] h-[21px] object-fill"
										/>
									</div>
									<div className="flex items-center self-stretch pt-5 pb-2 gap-[11px]">
										<span className="text-[#6F6F6F] text-[10px] font-bold" >
											14 Rotors
										</span>
										<span className="text-[#6F6F6F] text-[10px] font-bold" >
											18 Brake Pads
										</span>
									</div>
								</div>
								<div className="flex flex-col bg-white w-[248px] p-3 mr-[17px] gap-7 rounded-xl" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<div className="flex justify-between items-start self-stretch">
										<div className="flex flex-col w-[122px] gap-1">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													STOCK VOLUME
												</span>
											</div>
											<div className="flex items-center self-stretch gap-1.5">
												<span className="text-[#1B1C1C] text-[26px] font-bold" >
													485
												</span>
												<span className="text-[#2E7D32] text-[10px] font-bold" >
													Units Healthy
												</span>
											</div>
										</div>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/161eqy92_expires_30_days.png"} 
											className="w-[17px] h-[18px] object-fill"
										/>
									</div>
									<div className="items-start self-stretch bg-[#EAE7E7] rounded-[9999px]">
										<div className="bg-[#2E7D32] w-[175px] h-1.5 rounded-[9999px]">
										</div>
									</div>
								</div>
								<div className="bg-white w-[248px] p-3 rounded-xl" 
									style={{
										boxShadow: "0px 1px 2px #0000000D"
									}}>
									<div className="flex justify-between items-start self-stretch">
										<div className="flex flex-col w-[103px] gap-1">
											<div className="flex flex-col items-start self-stretch">
												<span className="text-[#6F6F6F] text-[11px] font-bold" >
													Critical ALERTS
												</span>
											</div>
											<div className="flex items-center self-stretch gap-1.5">
												<span className="text-[#BA1A1A] text-[26px] font-bold" >
													3
												</span>
												<span className="text-[#BA1A1A] text-[10px] font-bold" >
													SKUs Urgent
												</span>
											</div>
										</div>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/yhsy9suk_expires_30_days.png"} 
											className="w-5 h-[17px] object-fill"
										/>
									</div>
									<div className="flex flex-col items-start self-stretch pt-3">
										<span className="text-[#C62828] text-[10px] font-bold" >
											D03S 4-Piston Mellanic Pads critical
										</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col self-stretch bg-white p-3 gap-3 rounded-xl" 
								style={{
									boxShadow: "0px 1px 2px #0000000D"
								}}>
								<div className="flex items-center self-stretch">
									<button className="flex shrink-0 items-center bg-[#FAFAF8] text-left py-[9px] px-3.5 gap-3.5 rounded-xl border border-solid border-[#E8E3DD]"
										onClick={()=>alert("Pressed!")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/7q471nig_expires_30_days.png"} 
											className="w-[13px] h-[18px] object-fill"
										/>
										<span className="text-[#6F6F6F] text-[13px]" >
											Search brake SKU, rotor size, pad compound, bin rack...
										</span>
									</button>
									<div className="flex shrink-0 items-center">
										<div className="flex shrink-0 items-center bg-[#FAFAF8] p-[5px] mr-[5px] rounded-xl border border-solid border-[#E8E3DD99]">
											<div className="flex flex-col shrink-0 items-start bg-white py-1 px-3 mr-[1px] rounded-lg">
												<span className="text-[#924C00] text-xs font-bold" >
													All (42)
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start py-1 px-3 mr-[1px] rounded-lg">
												<span className="text-[#6F6F6F] text-xs font-bold" >
													Optimal
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start py-1 px-3 rounded-lg">
												<span className="text-[#F57F17] text-xs font-bold" >
													Low Stock (2)
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start py-1 px-3 rounded-lg">
												<span className="text-[#C62828] text-xs font-bold" >
													Critical (1)
												</span>
											</div>
										</div>
										<div className="flex flex-col shrink-0 items-start bg-[#FAFAF8] py-2 pl-[17px] pr-10 mr-1 rounded-xl border border-solid border-[#E8E3DD]">
											<span className="text-[#1B1C1C] text-[13px]" >
												Mount Type: All
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start bg-[#FAFAF8] py-2 pl-[17px] pr-[89px] rounded-xl border border-solid border-[#E8E3DD]">
											<span className="text-[#1B1C1C] text-[13px]" >
												Sort: Criticality first
											</span>
										</div>
									</div>
								</div>
								<div className="self-stretch rounded-lg">
									<div className="flex items-center self-stretch bg-[#FAFAF8]">
										<div className="flex flex-col shrink-0 items-start py-5 pl-4 pr-[37px]">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												ICON
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start py-5 pl-3">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												PRODUCT &amp; TECHNICAL SPECS
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-5 pl-2 pr-[51px] mr-[1px]">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												SKU / CODE
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-3 pl-2 pr-[57px]">
											<span className="text-[#6F6F6F] text-[11px] font-bold w-[104px]" >
												STOCK\nCAPACITY
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-5 px-2">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												UNIT PRICE
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-5 px-[29px] mr-[1px]">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												STATUS
											</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-5 pl-14 pr-[19px]">
											<span className="text-[#6F6F6F] text-[11px] font-bold" >
												ACTIONS
											</span>
										</div>
									</div>
									<div className="flex flex-col self-stretch">
										<div className="flex items-center self-stretch">
											<div className="shrink-0 items-start py-3.5 px-4">
												<div className="bg-[#F6F3F2] w-12 h-12 rounded-xl border border-solid border-[#E8E3DD]">
												</div>
											</div>
											<div className="flex flex-col w-[314px] pl-3 gap-[1px]">
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#1B1C1C] text-xs font-bold" >
														Shimano SM-RT56 160mm 6-Bolt Rotor
													</span>
												</div>
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#6F6F6F] text-[11px] font-bold" >
														Stainless Steel Resin-Only • IS 6-Bolt Standard
													</span>
												</div>
											</div>
											<div className="flex flex-col shrink-0 items-start py-[26px] pl-5 pr-10 mr-[1px]">
												<span className="text-[#1B1C1C] text-[11px] font-bold" >
													BRK-SHI-RT56
												</span>
											</div>
											<div className="flex flex-col w-[162px] px-2 gap-1">
												<div className="flex justify-between items-center self-stretch">
													<span className="text-[#1B1C1C] text-[11px] font-bold" >
														18 / 30 units
													</span>
													<span className="text-[#6F6F6F] text-[11px] font-bold" >
														60%
													</span>
												</div>
												<div className="items-start self-stretch bg-[#EAE7E7] rounded-[9999px]">
													<div className="bg-[#E98B3A] w-[92px] h-1.5 rounded-[9999px]">
													</div>
												</div>
											</div>
											<div className="flex flex-col items-start w-[90px] py-5">
												<span className="text-[#1B1C1C] text-[13px] font-bold ml-7" >
													₱750.00
												</span>
												<div className="flex flex-col items-start self-stretch pl-[13px] mx-4">
													<span className="text-[#6F6F6F] text-[10px]" >
														Cost: ₱520
													</span>
												</div>
											</div>
											<div className="flex flex-col shrink-0 items-start py-8 px-[33px] mr-[1px]">
												<span className="text-[#2E7D32] text-[10px] font-bold" >
													Optimal
												</span>
											</div>
											<div className="flex shrink-0 items-center py-[23px] pl-[23px] gap-[7px]">
												<button className="flex flex-col shrink-0 items-start bg-[#FAFAF8] text-left py-[5px] px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#BA1A1A] text-xs font-bold" >
														- Out
													</span>
												</button>
												<button className="flex flex-col shrink-0 items-start bg-[#FAFAF8] text-left py-[5px] px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#2E7D32] text-xs font-bold" >
														+ In
													</span>
												</button>
											</div>
										</div>
										<div className="flex items-center self-stretch py-[1px]">
											<div className="bg-[#F6F3F2] w-12 h-12 mx-4 rounded-xl border border-solid border-[#E8E3DD]">
											</div>
											<div className="flex flex-col w-[314px] pl-3 gap-0.5">
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#1B1C1C] text-xs font-bold" >
														Shimano B01S Resin Disc Brake Pads
													</span>
												</div>
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#6F6F6F] text-[11px] font-bold" >
														2-Piston Compound • With Split Pin &amp; Spring
													</span>
												</div>
											</div>
											<div className="flex flex-col shrink-0 items-start py-[26px] pl-5 pr-[39px] mr-[1px]">
												<span className="text-[#1B1C1C] text-[11px] font-bold" >
													BRK-PAD-B01S
												</span>
											</div>
											<div className="flex flex-col w-[162px] px-2 gap-1">
												<div className="flex justify-between items-center self-stretch">
													<span className="text-[#F57F17] text-[11px] font-bold" >
														8 / 25 units
													</span>
													<span className="text-[#F57F17] text-[11px] font-bold" >
														32%
													</span>
												</div>
												<div className="items-start self-stretch bg-[#EAE7E7] rounded-[9999px]">
													<div className="bg-[#F57F17] w-[49px] h-1.5 rounded-[9999px]">
													</div>
												</div>
											</div>
											<div className="flex flex-col items-start w-[90px] py-5">
												<span className="text-[#1B1C1C] text-[13px] font-bold ml-[27px]" >
													₱420.00
												</span>
												<div className="flex flex-col items-start self-stretch pl-[13px] mx-4">
													<span className="text-[#6F6F6F] text-[10px]" >
														Cost: ₱260
													</span>
												</div>
											</div>
											<div className="flex flex-col shrink-0 items-start py-[29px] px-[26px] mr-[1px]">
												<span className="text-[#F57F17] text-[10px] font-bold" >
													Low Stock
												</span>
											</div>
											<div className="flex shrink-0 items-center py-[23px] pl-[23px] mr-[1px] gap-[7px]">
												<button className="flex flex-col shrink-0 items-start bg-[#FAFAF8] text-left py-[5px] px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#BA1A1A] text-xs font-bold" >
														- Out
													</span>
												</button>
												<button className="flex flex-col shrink-0 items-start bg-[#FAFAF8] text-left py-[5px] px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#2E7D32] text-xs font-bold" >
														+ In
													</span>
												</button>
											</div>
										</div>
										<div className="flex items-center self-stretch bg-[#F0EDED33] py-[1px]">
											<div className="shrink-0 items-start py-3.5 px-4">
												<div className="bg-[#F6F3F2] w-12 h-12 rounded-xl border border-solid border-[#E8E3DD33]">
												</div>
											</div>
											<div className="flex flex-col w-[314px] pl-3 gap-0.5">
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#1B1C1C] text-xs font-bold" >
														Shimano D03S 4-Piston Metallic Pads
													</span>
												</div>
												<div className="flex flex-col items-start self-stretch">
													<span className="text-[#6F6F6F] text-[11px] font-bold" >
														XT / Zee / Saint Compatibility • High Heat Sintered
													</span>
												</div>
											</div>
											<div className="flex flex-col shrink-0 items-start py-[26px] pl-5 pr-[39px] mr-[1px]">
												<span className="text-[#1B1C1C] text-[11px] font-bold" >
													BRK-PAD-D03S
												</span>
											</div>
											<div className="flex flex-col w-[162px] px-2 gap-1">
												<div className="flex justify-between items-center self-stretch">
													<span className="text-[#BA1A1A] text-[11px] font-bold" >
														4 / 40 units
													</span>
													<span className="text-[#BA1A1A] text-[11px] font-bold" >
														10%
													</span>
												</div>
												<div className="items-start self-stretch bg-[#EAE7E7] rounded-[9999px]">
													<div className="bg-[#BA1A1A] w-[15px] h-1.5 rounded-[9999px]">
													</div>
												</div>
											</div>
											<div className="flex flex-col items-start w-[90px] py-5">
												<span className="text-[#1B1C1C] text-[13px] font-bold ml-[27px]" >
													₱890.00
												</span>
												<div className="flex flex-col items-start self-stretch pl-[13px] mx-4">
													<span className="text-[#6F6F6F] text-[10px]" >
														Cost: ₱590
													</span>
												</div>
											</div>
											<div className="flex flex-col shrink-0 items-center py-[29px] px-[34px] mr-[1px]">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/6e1nl8dm_expires_30_days.png"} 
													className="w-2.5 h-2.5 object-fill"
												/>
												<span className="text-[#C62828] text-[10px] font-bold" >
													Critical
												</span>
											</div>
											<div className="flex shrink-0 items-center py-[23px] pl-[23px] gap-[7px]">
												<button className="flex flex-col shrink-0 items-start bg-[#FAFAF8] text-left py-[5px] px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#BA1A1A] text-xs font-bold" >
														- Out
													</span>
												</button>
												<button className="flex flex-col shrink-0 items-start bg-[#FAFAF8] text-left py-[5px] px-[11px] rounded-lg border border-solid border-[#E8E3DD]"
													onClick={()=>alert("Pressed!")}>
													<span className="text-[#2E7D32] text-xs font-bold" >
														+ In
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
								<div className="flex justify-between items-center self-stretch py-1">
									<span className="text-[#6F6F6F] text-[11px] font-bold" >
										Showing 6 of 10 active Braking System catalog items
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/mup3kzgl_expires_30_days.png"} 
										className="w-[117px] h-6 object-fill"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="flex-1 bg-white w-[265px] absolute top-0 bottom-0 left-[-256px] pb-[116px]" 
						style={{
							boxShadow: "0px 1px 8px #00000008"
						}}>
						<div className="self-stretch py-[18px]">
							<div className="flex items-center self-stretch mb-[21px] ml-6 mr-0.5 gap-3">
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/dtm7mla8_expires_30_days.png"} 
									className="w-12 h-12 rounded-xl object-fill"
								/>
								<div className="flex flex-1 flex-col items-start">
									<span className="text-slate-900 text-base font-bold" >
										Vjay&#39;s
									</span>
									<span className="text-slate-500 text-[11px]" >
										Bike Parts and Accessories
									</span>
								</div>
							</div>
							<div className="flex flex-col self-stretch p-4 mb-[206px] gap-1">
								<div className="flex items-center self-stretch py-2.5 rounded-lg">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/o9g5749c_expires_30_days.png"} 
										className="w-5 h-5 mx-3 rounded-lg object-fill"
									/>
									<span className="text-slate-600 text-sm" >
										Dashboard
									</span>
								</div>
								<div className="flex flex-col self-stretch pt-2 gap-1">
									<div className="flex justify-between items-center self-stretch py-2.5 px-3 rounded-xl" 
										style={{
											boxShadow: "0px 1px 2px #0000000D"
										}}>
										<div className="flex shrink-0 items-center gap-3">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/tuksmkgg_expires_30_days.png"} 
												className="w-5 h-5 object-fill"
											/>
											<span className="text-slate-600 text-sm font-bold" >
												Products 
											</span>
										</div>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/3ofea52o_expires_30_days.png"} 
											className="w-4 h-4 rounded-xl object-fill"
										/>
									</div>
									<div className="flex flex-col items-start self-stretch pr-2 gap-1">
										<div className="flex flex-col items-start self-stretch py-1.5 ml-10">
											<span className="text-slate-500 text-xs" >
												All Parts
											</span>
										</div>
										<div className="flex items-center bg-orange-50 py-1.5 ml-10 rounded-lg border border-solid border-orange-200">
											<div className="flex flex-col shrink-0 items-start pr-[11px] mr-[66px]">
												<span className="text-orange-700 text-xs font-bold" >
													   Braking System
												</span>
											</div>
											<div className="flex flex-col shrink-0 items-start bg-red-500 py-[1px] px-1.5 rounded-[9999px]">
												<span className="text-white text-[10px] font-bold" >
													2
												</span>
											</div>
										</div>
										<div className="flex justify-between items-center self-stretch py-0.5 ml-10">
											<span className="text-slate-500 text-xs" >
												Drivetrain &amp; Chains
											</span>
											<div className="flex flex-col shrink-0 items-start bg-red-500 py-[1px] px-1.5 rounded-[9999px]">
												<span className="text-white text-[10px] font-bold" >
													1
												</span>
											</div>
										</div>
										<div className="flex flex-col items-center py-1.5 ml-10">
											<span className="text-slate-500 text-xs" >
												Gears &amp; Sprockets
											</span>
										</div>
									</div>
								</div>
								<div className="self-stretch pt-2">
									<div className="flex flex-col items-start self-stretch pl-3">
										<span className="text-slate-400 text-[10px] font-bold" >
											OPERATIONS
										</span>
									</div>
									<div className="flex items-center self-stretch py-3 pl-3 gap-3 rounded-lg">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/2du3iuoq_expires_30_days.png"} 
											className="w-5 h-5 object-fill"
										/>
										<span className="text-slate-600 text-sm" >
											Stock Movement
										</span>
									</div>
									<div className="flex justify-between items-center self-stretch py-2.5 px-3 rounded-lg">
										<div className="flex shrink-0 items-center gap-3">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/UjqMgCp8GJ/cduubces_expires_30_days.png"} 
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
				</div>
			</div>
		</div>
	)
}