import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TransactionDetails from "./TransactionDetails";
import { TransactionData } from "./interfaces";
import { SourceWallets } from "./types";

interface WildfireModalProps {
	isOpen: boolean;
	closeModal: () => void;
	handleDonate: (transactionData: TransactionData) => void;
	title?: string;
	subtitle?: string;
	destinationPreferredAsset: SourceWallets[0]["preferred_asset"] | null;
	availableSourceAssets: string[];
	approximateAmountDeducted: string | null;
	isSubmitting: boolean;
	txSubmitData: {
		success: boolean;
		link?: string;
		error?: string;
	} | null;
}

function WildfireModal({
	isOpen,
	closeModal,
	handleDonate,
	title,
	subtitle,
	destinationPreferredAsset,
	availableSourceAssets,
	approximateAmountDeducted,
	isSubmitting,
	txSubmitData,
}: WildfireModalProps) {
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[900]" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h2"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									<button
										type="button"
										className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
										onClick={closeModal}
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											></path>
										</svg>
									</button>
									{title}
								</Dialog.Title>
								<p className="mt-1 font-medium text-gray-900">
									Destination:
									<span className="ml-1 font-normal text-gray-500">
										{subtitle}
									</span>
								</p>
								<TransactionDetails
									handleDonate={handleDonate}
									destinationPreferredAsset={destinationPreferredAsset}
									availableSourceAssets={availableSourceAssets}
									approximateAmountDeducted={approximateAmountDeducted}
									isSubmitting={isSubmitting}
									txSubmitData={txSubmitData}
								/>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default WildfireModal;
