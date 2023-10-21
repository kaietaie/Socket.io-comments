const validationEmail =  (email: string) => {
    const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.toLowerCase().trim().match(validRegex)?.toString()
}

export default validationEmail