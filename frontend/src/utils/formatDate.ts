import React, { DataHTMLAttributes } from 'react'

function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {

  let formatted = new Intl.DateTimeFormat("fin", options).format(date)
  return formatted[0].toUpperCase() + formatted.slice(1);
}

export default formatDate