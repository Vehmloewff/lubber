import { L } from './deps.ts'
import { EnvelopePreview } from './envelope.ts'

L.renderDom(
	L.Padding({
		padding: 20,

		child: L.Column({
			children: [
				EnvelopePreview({
					balance: 43.34,
					image:
						'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
					name: 'Groceries',
					onPressed() {
						console.log('Pressed')
					},
				}),
			],
		}),
	}),
)
