import { useEffect, useState } from 'react'

function useDeBounce(value, delay = 500) {
	const [debounceVal, setDebounceVal] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounceVal(value)
		}, delay)
		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debounceVal
}
export default useDeBounce
