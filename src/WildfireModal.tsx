import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TransactionDetails from "./TransactionDetails";
import { TransactionData } from "./interfaces";
import { SourceWallets } from "./types";

interface ModalProps {
	isOpen: boolean;
	closeModal: () => void;
	handleDonate: (transactionData: TransactionData) => void;
	title?: string;
	subtitle?: string;
	destinationPreferredAsset: SourceWallets[0]["preferred_asset"] | null;
	availableSourceAssets: string[];
}

function Modal({
	isOpen,
	closeModal,
	handleDonate,
	title,
	subtitle,
	destinationPreferredAsset,
	availableSourceAssets,
}: ModalProps) {
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
								/>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default Modal;
