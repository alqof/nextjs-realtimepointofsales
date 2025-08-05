'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HandCoins, ListTodo, NotebookPen, ShoppingCart, TrendingUp, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts'


type barType = { date: string; total: number; }
type areaType = { date: string; coffee: number; nonCoffee: number; food: number; snack: number; }
type pieType = { category: string; value: number; fill: string; }

const days = 365
const today = new Date()

// Chart config
const barChartConfig = {
    total: { label: "Total Income", color: "var(--chart-2)" },
} satisfies ChartConfig

const areaChartConfig = {
    coffee: { label: "Coffee", color: "var(--chart-1)" },
    nonCoffee: { label: "Non-Coffee", color: "var(--chart-2)" },
    food: { label: "Food", color: "var(--chart-3)" },
    snack: { label: "Snack", color: "var(--chart-4)" },
} satisfies ChartConfig

const pieChartConfig = {
    coffee: { label: "Coffee", color: "var(--chart-1)" },
    nonCoffee: { label: "Non-Coffee", color: "var(--chart-2)" },
    food: { label: "Food", color: "var(--chart-3)" },
    snack: { label: "Snack", color: "var(--chart-4)" },
} satisfies ChartConfig


export default function DashboardContent() {
    // Data states
    const [barChartData, setBarChartData] = useState<barType[]>([])
    const [areaChartData, setAreaChartData] = useState<areaType[]>([])
    const [pieChartData, setPieChartData] = useState<pieType[]>([])
    const [dateNow, setDateNow] = useState('')
    // Active Chart (hanya ada satu: totalIncome)
    const [activeChart, setActiveChart] = useState<keyof typeof barChartConfig>("total")
    const [timeRange, setTimeRange] = useState("30d")

    // Generate random data in client only
    useEffect(() => {
        const barArr: barType[] = []
        const areaArr: areaType[] = []
        const pieSummary = { coffee: 0, nonCoffee: 0, food: 0, snack: 0 }

        for (let i=0; i<days; i++) {
            const dateObj = new Date(today)
            dateObj.setDate(today.getDate() - i)

            const min = 1;
            const max = 20;
            const date = dateObj.toISOString().split('T')[0]
            if (i===0) {
                setDateNow(dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
            }
            const coffee = Math.floor(Math.random() * (max - min + 1)) + min;
            const nonCoffee = Math.floor(Math.random() * (max - min + 1)) + min;
            const food = Math.floor(Math.random() * (max - min + 1)) + min;
            const snack = Math.floor(Math.random() * (4 - min + 1)) + min;
            const total = coffee * 12000 + nonCoffee*10000 + food*15000 + snack * 8000

            pieSummary.coffee += coffee
            pieSummary.nonCoffee += nonCoffee
            pieSummary.food += food
            pieSummary.snack += snack

            barArr.push({ date, total })
            areaArr.push({ date, coffee, nonCoffee, food, snack })
        }

        setBarChartData(barArr.reverse())
        setAreaChartData(areaArr.reverse())

        // Pie chart: total sum per category for last 30 days (past month)
        const pieData: pieType[] = [
            { category: "coffee", value: pieSummary.coffee, fill: "rgb(59, 135, 62)" },
            { category: "nonCoffee", value: pieSummary.nonCoffee, fill: "rgb(65, 132, 183)" },
            { category: "food", value: pieSummary.food, fill: "rgb(242, 165, 65)" },
            { category: "snack", value: pieSummary.snack, fill: "rgb(238, 108, 77)" },
        ]
        setPieChartData(pieData)
    }, [])

    // Memo total
    const memoBarChart = useMemo(() => ({
        total: barChartData.reduce((acc, curr) => acc + curr.total, 0),
    }), [barChartData])

    // Filter area chart by range
    const filteredData = useMemo(() => {
        const referenceDate = new Date(today)
        let daysToSubtract = 90
        if (timeRange === "7d") daysToSubtract = 7
        else if (timeRange === "30d") daysToSubtract = 30
        else if (timeRange === "180d") daysToSubtract = 180
        else if (timeRange === "356d") daysToSubtract = 365
        else if (timeRange === "ytd") daysToSubtract = referenceDate.getDate() + (referenceDate.getMonth() * 30)
        else if (timeRange === "all") daysToSubtract = days
        const startDate = new Date(referenceDate)
        startDate.setDate(referenceDate.getDate() - daysToSubtract)
        return areaChartData.filter(item => new Date(item.date) >= startDate)
    }, [timeRange, areaChartData])

    return(
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> Dashboard </h1>

            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative w-full h-36 p-4 rounded-lg bg-green-200" style={{background: "linear-gradient(180deg,rgba(13, 84, 43, 1) 0%, rgba(0, 36, 0, 1) 100%)"}}>
                        <p className='mb-1 capitalize text-white text-sm'>Total Menu</p>
                        <span className='libertinus-serif-semibold text-white text-2xl md:text-4xl text-shadow-lg/30'>20</span>

                        <div className="absolute right-2 bottom-2">
                            <Wallet className='opacity-25 size-16' color='#fff' />
                        </div>
                    </div>
                    <div className="relative w-full h-36 p-4 rounded-lg bg-green-200" style={{background: "linear-gradient(180deg,rgba(13, 84, 43, 1) 0%, rgba(0, 36, 0, 1) 100%)"}}>
                        <p className='mb-1 capitalize text-white text-sm'>Menu Sold</p>
                        <span className='libertinus-serif-semibold text-white text-2xl md:text-4xl text-shadow-lg/30'>96</span>

                        <div className="absolute right-2 bottom-2">
                            <NotebookPen className='opacity-25 size-16' color='#fff' />
                        </div>
                    </div>
                    <div className="relative w-full h-36 p-4 rounded-lg bg-green-200" style={{background: "linear-gradient(180deg,rgba(13, 84, 43, 1) 0%, rgba(0, 36, 0, 1) 100%)"}}>
                        <p className='mb-1 capitalize text-white text-sm'>Total Order</p>
                        <span className='libertinus-serif-semibold text-white text-2xl md:text-4xl text-shadow-lg/30'>324</span>

                        <div className="absolute right-2 bottom-2">
                            <ShoppingCart className='opacity-25 size-16' color='#fff' />
                        </div>
                    </div>
                    <div className="relative w-full h-36 p-4 rounded-lg bg-green-200" style={{background: "linear-gradient(180deg,rgba(13, 84, 43, 1) 0%, rgba(0, 36, 0, 1) 100%)"}}>
                        <p className='mb-1 capitalize text-sm text-white'>Average Income <span className='text-xs lowercase font-bold italic'>&#47;day</span></p>
                        <span className='libertinus-serif-semibold text-white text-2xl md:text-4xl text-shadow-lg/30'>Rp 489.500</span>

                        <div className="absolute right-2 bottom-2">
                            <HandCoins className='opacity-25 size-16' color='#fff' />
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="col-span-3 py-0">
                        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                                <CardTitle> Sales Trend Income </CardTitle>
                                <CardDescription> Showing total income for the last year </CardDescription>
                            </div>
                            <div className="flex">
                                {Object.keys(barChartConfig).map((key) => {
                                    const chart = key as keyof typeof barChartConfig
                                    return (
                                        <button key={chart} data-active={activeChart === chart} className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6" onClick={() => setActiveChart(chart)}>
                                            <span className="text-muted-foreground text-xs">{barChartConfig[chart].label}</span>
                                            <span className="text-lg leading-none font-bold sm:text-3xl"> Rp {memoBarChart[chart as keyof typeof memoBarChart].toLocaleString('id-ID')} </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 sm:p-6">
                            <ChartContainer config={barChartConfig} className="aspect-auto h-[250px] w-full" >
                            <BarChart accessibilityLayer data={barChartData} margin={{ left: 12, right: 12, }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="views"
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }}
                                        />
                                    }
                                />
                                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                            </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>


                    <Card className="col-span-1 flex flex-col gap-4">
                        <CardHeader className="items-center pb-0">
                            <CardTitle> Total Sales For Each Category </CardTitle>
                            <CardDescription> {dateNow} </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 pb-0">
                            <ChartContainer config={pieChartConfig} className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={pieChartData} dataKey="value" label nameKey="category" />
                            </PieChart>
                            </ChartContainer>
                        </CardContent>

                        <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center font-medium">
                                <p>Trending up <span className="font-extrabold">8,2%</span> by all category</p> <TrendingUp className="h-4 w-4" />
                            </div>
                        </CardFooter>
                    </Card>


                    <Card className="col-span-2 pt-0 gap-4">
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1">
                                <CardTitle> Sales Trend by Product Category </CardTitle>
                                <CardDescription> Showing total daily sales </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
                                    <SelectValue placeholder="Last 3 months" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="7d" className="rounded-lg"> Last 7 days </SelectItem>
                                    <SelectItem value="30d" className="rounded-lg"> Last 1 months </SelectItem>
                                    <SelectItem value="180d" className="rounded-lg"> Last 6 months </SelectItem>
                                    <SelectItem value="356d" className="rounded-lg"> Last year </SelectItem>
                                    <SelectItem value="ytd" className="rounded-lg"> Year to date </SelectItem>
                                    <SelectItem value="all" className="rounded-lg"> All </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>

                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <ChartContainer config={areaChartConfig} className="aspect-auto h-[250px] w-full">
                                <AreaChart data={filteredData}>
                                    <defs>
                                        <linearGradient id="fillCoffee" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B873E" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B873E" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="fillNonCoffee" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4184B7" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4184B7" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="fillFood" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F2A541" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#F2A541" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="fillSnack" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EE6C4D" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#EE6C4D" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid vertical={false} />

                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                    />

                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => {
                                                return new Date(value).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                            }}
                                            indicator="dot"
                                        />
                                        }
                                    />

                                    <Area dataKey="coffee" type="natural" fill="url(#fillCoffee)" stroke="#3B873E" stackId="a" />
                                    <Area dataKey="nonCoffee" type="natural" fill="url(#fillNonCoffee)" stroke="#4184B7" stackId="a" />
                                    <Area dataKey="food" type="natural" fill="url(#fillFood)" stroke="#F2A541" stackId="a" />
                                    <Area dataKey="snack" type="natural" fill="url(#fillSnack)" stroke="#EE6C4D" stackId="a" />

                                    <ChartLegend content={<ChartLegendContent />} />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}