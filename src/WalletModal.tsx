import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
	isOpen: boolean;
	closeModal: () => void;
	onSuccess: () => void;
}

function WalletModal({ isOpen, closeModal, onSuccess }: ModalProps) {
	async function handleConnectionXBull() {
		try {
			await window.xBullSDK.connect({
				canRequestPublicKey: true,
				canRequestSign: true,
			});
			onSuccess();
		} catch (error) {
			console.error(error);
		}
		closeModal();
	}

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
					<div className="flex min-h-full items-center justify-center text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-96 max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-0 text-left align-middle shadow-xl transition-all">
								<Dialog.Title>
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
									<div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
										<h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
											Connect wallet
										</h3>
									</div>
								</Dialog.Title>
								<div className="p-6">
									<p className="text-sm font-normal text-gray-500 dark:text-gray-400">
										Connect with one of our available wallet providers or create
										a new one.
									</p>
									<ul className="my-4 space-y-3">
										<li>
											<button
												onClick={handleConnectionXBull}
												className="flex items-center p-3 w-full text-left text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
											>
												<img
													src="/xBull_logo.jpg"
													alt="xBull Logo"
													className="h-8 w-8"
												/>
												<span className="flex-1 ml-3 whitespace-nowrap">
													xBull
												</span>
											</button>
										</li>
										<li>
											<button className="flex items-center p-3 w-full text-left text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
												<img
													src="/Alvedo_logo.svg"
													alt="Alvedo Logo"
													className="h-8 w-8"
												/>
												<span className="flex-1 ml-3 whitespace-nowrap">
													Albedo
												</span>
												<span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
													Soon
												</span>
											</button>
										</li>
									</ul>
									<div>
										<a
											href="#"
											className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
										>
											<svg
												className="mr-2 w-3 h-3"
												aria-hidden="true"
												focusable="false"
												data-prefix="far"
												data-icon="question-circle"
												role="img"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 512 512"
											>
												<path
													fill="currentColor"
													d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
												></path>
											</svg>
											Why do I need to connect with my wallet?
										</a>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default WalletModal;
