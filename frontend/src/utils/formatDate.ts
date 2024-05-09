import React, { DataHTMLAttributes } from 'react'

function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {

  return new Intl.DateTimeFormat("fin", options).format(date)
}

export default formatDate