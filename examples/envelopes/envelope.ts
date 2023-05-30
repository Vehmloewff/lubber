import { L } from './deps.ts'

export interface EnvelopeParams {
	name: string
	balance: number
	image: string
	onPressed(): void
}

export function EnvelopePreview(params: EnvelopeParams) {
	const { $, render } = L.makeComponent()

	const getColor = () => {
		if (params.balance > 0) L.currentTheme.get().success
		return L.currentTheme.get().error
	}

	const getBalanceLabel = () => `$${params.balance.toFixed(2)}`

	const nameLabel = L.Label(params.name, {
		fontSize: 20,
		color: L.currentTheme.get().background,
	})

	const balanceLabel = L.Label(getBalanceLabel(), {
		fontSize: 20,
		color: getColor(),
		bold: true,
	})

	const imageComponent = L.Image(params.image, { fit: 'cover' })

	const container = L.Container({
		borderRadius: 10,
		clip: true,
		child: L.Stack({
			children: [
				L.StackItem({ child: imageComponent, inset: 0 }),
				L.StackItem({
					inset: 0,
					child: L.Container({
						color: L.setAlpha(L.currentTheme.get().foreground, 0.5),
						child: L.Padding({
							paddingX: 15,
							child: L.Row({
								gap: 10,
								align: 'center',
								children: [
									L.FlexItem({
										expand: true,
										child: nameLabel,
									}),
									balanceLabel,
								],
							}),
						}),
					}),
				}),
			],
		}),
	})

	render(
		L.SizedBox({ height: 100, child: container }),
	)

	function setName() {}

	function setBalance() {}

	function setImage() {}

	return { $, setName, setBalance, setImage }
}
