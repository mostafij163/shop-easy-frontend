import { useEffect, useState } from "react";

const localCache = {}

export default function useBreed(animal) {
    const [breeds, setBreeds] = useState([])
    const [status, setStatus] = useState('unloaded')

    useEffect(function () {
        if (!animal) {
            setBreeds([])
        } else if (localCache[animal]) {
            setBreeds(localCache[animal])
        } else {
            requestAnimal();
        }

        async function requestAnimal() {
            setBreeds([])
            setStatus('loding')
            const res = await fetch(`http://pets-v2.dev-apis.com/breeds?animal=${animal}`)
            const jsonRes = await res.json();
            localCache[animal] = jsonRes.breeds || []
            setBreeds(localCache[animal])
            setStatus('loaded')
        }
    }, [animal])

    return [breeds, status]
}