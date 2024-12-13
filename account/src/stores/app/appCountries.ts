import { defineStore } from 'pinia'

interface countries {
  code: string
  name: string
  iso: string
}

export const useAppCountries = defineStore('appcountries', () => {
  const countries = ref<countries[]>([
    { name: "albania", code: "355", iso: "al" },
    { name: "andorra", code: "376", iso: "ad" },
    { name: "armenia", code: "374", iso: "am" },
    { name: "austria", code: "43", iso: "at" },
    { name: "belarus", code: "375", iso: "by" },
    { name: "belgium", code: "32", iso: "be" },
    { name: "bosnia and herzegovina", code: "387", iso: "ba" },
    { name: "bulgaria", code: "359", iso: "bg" },
    { name: "croatia", code: "385", iso: "hr" },
    { name: "cyprus", code: "357", iso: "cy" },
    { name: "czech republic", code: "420", iso: "cz" },
    { name: "denmark", code: "45", iso: "dk" },
    { name: "estonia", code: "372", iso: "ee" },
    { name: "finland", code: "358", iso: "fi" },
    { name: "france", code: "33", iso: "fr" },
    { name: "germany", code: "49", iso: "de" },
    { name: "greece", code: "30", iso: "gr" },
    { name: "hungary", code: "36", iso: "hu" },
    { name: "iceland", code: "354", iso: "is" },
    { name: "ireland", code: "353", iso: "ie" },
    { name: "italy", code: "39", iso: "it" },
    { name: "kosovo", code: "383", iso: "xk" },
    { name: "latvia", code: "371", iso: "lv" },
    { name: "liechtenstein", code: "41", iso: "li" },
    { name: "lithuania", code: "370", iso: "lt" },
    { name: "luxembourg", code: "352", iso: "lu" },
    { name: "malta", code: "356", iso: "mt" },
    { name: "moldova", code: "373", iso: "md" },
    { name: "monaco", code: "33", iso: "mc" },
    { name: "montenegro", code: "382", iso: "me" },
    { name: "netherlands", code: "31", iso: "nl" },
    { name: "north macedonia", code: "389", iso: "mk" },
    { name: "norway", code: "47", iso: "no" },
    { name: "poland", code: "48", iso: "pl" },
    { name: "portugal", code: "351", iso: "pt" },
    { name: "romania", code: "40", iso: "ro" },
    { name: "san marino", code: "378", iso: "sm" },
    { name: "serbia", code: "381", iso: "rs" },
    { name: "slovakia", code: "421", iso: "sk" },
    { name: "slovenia", code: "386", iso: "si" },
    { name: "spain", code: "34", iso: "es" },
    { name: "sweden", code: "46", iso: "se" },
    { name: "switzerland", code: "41", iso: "ch" },
    { name: "united kingdom", code: "44", iso: "gb" },
    { name: "canada", code: "1", iso: "ca" },
    { name: "united states", code: "1", iso: "us" }
]);


  function set(data: Partial<countries>) {
    countries.value = data
  }

  return {
    countries,
    set,
  } as const
})