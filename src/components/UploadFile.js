import React, { useState } from 'react'
import { parse } from 'papaparse'
import { Table } from 'react-bootstrap'

const UploadFile = () => {
	const [highlited, setHighlited] = useState(false)
	const [people, setPeople] = useState([])

	let dict = {}
	let pairs = {}

	for (let person of people) {
		if (!dict[person[1]]) {
			dict[person[1]] = []
		}
		dict[person[1]].push(person)
	}
	// console.log(dict)

	for (let pairables of Object.values(dict)) {
		// console.log(pairables)
		// for (let pairable of Object.values(pairables)) {
		// 	console.log(pairable)
		// }
		for (let i = 0; i < pairables.length; i++) {
			for (let j = i + 1; j < pairables.length; j++) {
				// console.log('pair')
				// console.log(pairables[i], pairables[j])
				// console.log(pairables[i][0], pairables[j][0])
				let employeesKey = [pairables[i][0], pairables[j][0]]
				if (employeesKey[0] === employeesKey[1]) {
					continue
				}
				if (employeesKey[0] > employeesKey[1]) {
					employeesKey = [employeesKey[1], employeesKey[0]]
				}
				if (!pairs[employeesKey]) {
					pairs[employeesKey] = {}
				}
				if (!pairs[employeesKey][pairables[i][1]]) {
					pairs[employeesKey][pairables[i][1]] = 0
				}

				let e1d1 = pairables[i][2]
				let e1d2 = pairables[i][3]
				let e2d1 = pairables[j][2]
				let e2d2 = pairables[j][3]

				let startDate1 = new Date(e1d1)
				let endDate1 = e1d2 === 'NULL' ? new Date() : new Date(e1d2)
				let startDate2 = new Date(e2d1)
				let endDate2 = e2d2 === 'NULL' ? new Date() : new Date(e2d2)

				let laterStart = startDate1 < startDate2 ? startDate2 : startDate1
				let earlierEnd = endDate1 < endDate2 ? endDate1 : endDate2

				let daysWorked = 10
				if (laterStart <= earlierEnd) {
					//worked together calculation
					let diffTime = Math.abs(earlierEnd - laterStart)
					daysWorked = Math.ceil(diffTime / (1000 * 60 * 60 * 24) + 1)
				} else {
					// not working together at all
					daysWorked = 0
				}
				pairs[employeesKey][pairables[i][1]] += daysWorked
			}
		}
	}
	// console.log(pairs)

	// for (const [key, value] of Object.entries(pairs)) {
	// 	console.log(key, value)
	// }

	return (
		<div>
			<h1 className='text-center'>Import File</h1>
			<div
				className={`p-4 rounded m-auto w-50 text-center font-weight-light border border-secondary ${
					highlited ? 'border-success bg-light' : 'border-secondary'
				}`}
				onDragEnter={() => {
					setHighlited(true)
				}}
				onDragLeave={() => {
					setHighlited(false)
				}}
				onDragOver={(e) => {
					e.preventDefault()
				}}
				onDrop={(e) => {
					e.preventDefault()
					setHighlited(false)

					Array.from(e.dataTransfer.files)
						.filter(
							(file) =>
								file.type === 'text/csv' ||
								file.type === 'application/vnd.ms-excel'
						)
						.forEach(async (file) => {
							//console.log(file)
							const text = await file.text()
							// console.log(text)
							const result = parse(text)
							// const array = result.data
							// console.log(array)
							// take the existing state and append to it the rows from the array
							setPeople((existingState) => [...existingState, ...result.data])
						})
				}}
			>
				Drop file here
			</div>

			{/* <div>
				{people.map((person) => (
					<h4>
						<strong>EmpID: </strong>
						{person[0]}, <strong>ProjectID: </strong>
						{person[1]}, <strong>DateFrom: </strong> {person[2]}, {''}
						<strong>DateTo</strong> {person[3]}
					</h4>
				))}
			</div> */}
			<h4>Pairs</h4>
			<Table stripped bordered hover variant='dark'>
				<thead>
					<tr>
						<th>EmployeeID #1</th>
						<th>EmployeeID #2</th>
						<th>ProjectID</th>
						<th>DaysWorked</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(pairs).map((pair) => (
						<tr>
							{/* {console.log(pair)} */}
							{/* this {console.log(Object.entries(pair[1])[0][1])} */}
							{/* {console.log(Object.entries(pair[1])[0][1])} */}
							{/* {console.log(pair[0].split(',')[0], pair[0].split(',')[1])} */}
							<td>{pair[0].split(',')[0]}</td>
							<td>{pair[0].split(',')[1]}</td>
							<td>{Object.entries(pair[1])[0][0]}</td>
							<td>{Object.entries(pair[1])[0][1]}</td>
						</tr>
					))}
				</tbody>
			</Table>
			<h4>Longest Time</h4>
			<Table stripped bordered hover variant='dark'>
				<thead>
					<tr>
						<th>EmployeeID #1</th>
						<th>EmployeeID #2</th>
						<th>ProjectID</th>
						<th>DaysWorked</th>
					</tr>
				</thead>
			</Table>
		</div>
	)
}

export default UploadFile
