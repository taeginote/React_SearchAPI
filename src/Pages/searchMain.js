import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import List from './searchList'
import RecentList from '../Pages/recentList'
function SearchMain() {
	const [list, setList] = useState([])
	const [input, setInput] = useState('')
	const [recent, setRecent] = useState([])
	const [focusInx, setFocusInx] = useState(-1)

	const getData = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:8080/search?key=${debounceVal}`,
			)
			setList(data)
		} catch (err) {}
	}

	const searchInput = e => {
		setInput(e.target.value)
	}

	useEffect(() => {
		getData()
	}, [debounceVal])

	const onSearchBtn = () => {
		if (input.trim().length === 0) return

		if (!localStorage.getItem('recent')) {
			localStorage.setItem('recent', JSON.stringify([]))
		}
		localStorage.setItem('recent', JSON.stringify(recent))
		const arr = JSON.parse(localStorage.getItem('recent'))

		//input은 input값, arr은 로컬스토리지에 저장한 최근검색어 배열[]이다
		if (arr.find(el => el === input)) {
			let overlapArr = arr.filter(el => el !== input)
			return (
				overlapArr.unshift(input),
				setRecent(overlapArr),
				localStorage.setItem('recent', JSON.stringify(overlapArr))
			)
		}

		arr.unshift(input)
		if (arr.length === 6) {
			arr.pop()
		}
		setRecent(arr)
		localStorage.setItem('recent', JSON.stringify(arr))
	}

	const onkeyDown = e => {
		if (e.nativeEvent.isComposing) return
		if (e.key === 'ArrowDown') {
			setFocusInx(prev => (prev + 1) % list.length)
		}
		if (e.key === 'ArrowUp') {
			focusInx === -1
				? setFocusInx(list.length - 1)
				: setFocusInx(prev => prev - 1)
		}
		if (e.key === 'Enter') {
			if (input.trim().length === 0) return
			if (!localStorage.getItem('recent')) {
				localStorage.setItem('recent', JSON.stringify([]))
			}
			localStorage.setItem('recent', JSON.stringify(recent))
			const arr = JSON.parse(localStorage.getItem('recent'))
			if (arr.find(el => el === input)) {
				let overlapArr = arr.filter(el => el !== input)
				return (
					overlapArr.unshift(input),
					setRecent(overlapArr),
					localStorage.setItem('recent', JSON.stringify(overlapArr))
				)
			}
			arr.unshift(list[focusInx])
			if (arr.length === 6) {
				arr.pop()
			}
			setRecent(arr)
			localStorage.setItem('recent', JSON.stringify(arr))
			setFocusInx(-1)
		}
	}

	return (
		<S.Div>
			<S.Search>
				<S.Title>Search.</S.Title>
				<S.InputWrapper>
					<S.Input
						onChange={searchInput}
						onKeyDown={onkeyDown}
						value={list.length !== 0 ? list[focusInx] : input}
						placeholder={'무엇이든 검색해보살 :)'}
					/>
					<S.Button1 onClick={onSearchBtn}>검색</S.Button1>
				</S.InputWrapper>
				{debounceVal.length === 0 && recent ? (
					<RecentList recent={recent} setRecent={setRecent} />
				) : (
					<List list={list} focusInx={focusInx} input={input} recent={recent} />
				)}
			</S.Search>
		</S.Div>
	)
}

export default SearchMain

const Div = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100px;
	background-color: #ebe9eb;
	border: none;
	height: 2000px;
`
const Input = styled.input`
	padding: 10px 320.5px 10px 22.5px;
	font-size: 18px;
	text-align: left;
	font-weight: bold;
	border-radius: 20px;
	border: 1px solid white;
	position: relative;
	margin: 30px 0 20px 0;
	border: 2px dashed gray;
	:focus {
		border: 2px dashed gray;
		outline: none;
	}
`

const Search = styled.button`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	border: none;
	border: 3px solid #121219;
	background-color: white;
	border-radius: 10px;
	padding: 0 30px;
	box-shadow: 10px 10px 0px #45c397;
`
const Button1 = styled.button`
	font-size: 20px;
	opacity: 0.6;
	font-weight: bold;
	border: none;
	cursor: pointer;
	position: absolute;
	top: 40px;
	right: 10px;
	border: none;
	background-color: white;
	:hover {
		color: gray;
	}
`
const Title = styled.div`
	font-size: 30px;
	font-weight: bold;
	margin: 30px 0 0 0;
	text-align: start;
`
const InputWrapper = styled.div`
	position: relative;
`
const S = {
	Div,
	Input,
	Search,
	Button1,
	Title,
	InputWrapper,
}
