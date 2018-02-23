const capitalize = require('./capitalize')

test('converts first letter of the word to capital', () => {
    expect(capitalize('berlin')).toBe('Berlin')
    expect(capitalize('BERLIN')).toBe('Berlin')
    expect(capitalize('b')).toBe('B')
    expect(capitalize('')).toBe('')
    expect(capitalize(undefined)).toBe('')
})
