#include <linux/module.h>
// para usar KERN_INFO
#include <linux/kernel.h>
//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/sched/mm.h>     
#include <linux/mm.h>          

#include <linux/tick.h>


#include <linux/kernel_stat.h>
#include <linux/time.h>

#include <linux/timer.h>


MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Sistemas Operativos 1 - Practica 2 - Modulo CPU");
MODULE_AUTHOR("Derek Esquivel Diaz");


static struct timer_list timer;


void getProcesses(struct task_struct *task, struct seq_file *archivo) {
	struct task_struct *child;
	struct list_head *list; 
    struct mm_struct *mm;
    unsigned long rss;

    mm = get_task_mm(task);

    if (mm) {
        rss = get_mm_rss(mm) << PAGE_SHIFT;
        mmput(mm);
    }

    long ram = rss / (1024*1024);

    if(ram > 16000){
        ram = 0;
    }
    
    /* Process ID, User ID, Process Name, State, Parent, RAM */
	seq_printf(archivo, "%d,%d,%-20s,%d,%d,%lu\n",task->pid, task->cred->uid,task->comm, task->__state, task->parent->pid, ram);
	list_for_each(list, &task->children) { 
		child = list_entry(list, struct task_struct, sibling);
		getProcesses(child, archivo);
	}
}

u64 get_idle_time(struct kernel_cpustat *kcs, int cpu)
{
	u64 idle, idle_usecs = -1ULL;

	if (cpu_online(cpu))
		idle_usecs = get_cpu_idle_time_us(cpu, NULL);

	if (idle_usecs == -1ULL)
		/* !NO_HZ or cpu offline so we can rely on cpustat.idle */
		idle = kcs->cpustat[CPUTIME_IDLE];
	else
		idle = idle_usecs * NSEC_PER_USEC;

	return idle;
}

static u64 get_iowait_time(struct kernel_cpustat *kcs, int cpu)
{
	u64 iowait, iowait_usecs = -1ULL;

	if (cpu_online(cpu))
		iowait_usecs = get_cpu_iowait_time_us(cpu, NULL);

	if (iowait_usecs == -1ULL)
		/* !NO_HZ or cpu offline so we can rely on cpustat.iowait */
		iowait = kcs->cpustat[CPUTIME_IOWAIT];
	else
		iowait = iowait_usecs * NSEC_PER_USEC;

	return iowait;
}

u64 nsec_to_clock_t(u64 x){
    return div_u64(x, NSEC_PER_SEC / USER_HZ);
}

long total_prev = 0;
long idle_prev = 0;

long total_current = 0;
long idle_current = 0;

static void timer_callback(struct timer_list *unused)
{
   int i;
	u64 user, nice, system, idle, iowait, irq, softirq, steal;
	u64 guest, guest_nice;

    long user_ = 0;
    long nice_ = 0;
    long system_ = 0;
    long idle_ = 0;

    long iowait_ = 0;
    long irq_ = 0;
    long softirq_ = 0;
    long steal_ = 0;

    long guest_ = 0;
    long guest_nice_ = 0;

    for_each_possible_cpu(i) {
        struct kernel_cpustat kcpustat;
		u64 *cpustat = kcpustat.cpustat;

		kcpustat_cpu_fetch(&kcpustat, i);

        user		= cpustat[CPUTIME_USER];
		nice		= cpustat[CPUTIME_NICE];
		system		= cpustat[CPUTIME_SYSTEM];
		idle		= get_idle_time(&kcpustat, i);
        iowait		= get_iowait_time(&kcpustat, i);
		irq		    = cpustat[CPUTIME_IRQ];
		softirq		= cpustat[CPUTIME_SOFTIRQ];
		steal		= cpustat[CPUTIME_STEAL];
        guest		= cpustat[CPUTIME_GUEST];
		guest_nice	= cpustat[CPUTIME_GUEST_NICE];

        user_ = user_ + nsec_to_clock_t(user);
        nice_ = nice_ + nsec_to_clock_t(nice);
        system_ = system_ + nsec_to_clock_t(system);
        idle_ = idle_ + nsec_to_clock_t(idle);

        iowait_ = iowait_ + nsec_to_clock_t(iowait);
        irq_ = irq_ + nsec_to_clock_t(irq);
        softirq_ = softirq_ + nsec_to_clock_t(softirq);
        steal_ = steal_ + nsec_to_clock_t(steal);

        guest_ = guest_ + nsec_to_clock_t(guest);
        guest_nice_ = guest_nice_ + nsec_to_clock_t(guest_nice);
    }

    long total = user_ + nice_ + system_ + idle_ + iowait_ + irq_ + softirq_ + steal_ + guest_ + guest_nice_;

    long idle_over_period = idle_ - idle_prev ;
    long total_over_period = total - total_prev ;

    total_prev = total;
    idle_prev = idle_;

    total_current = total_over_period;
    idle_current = idle_over_period;

   mod_timer(&timer, jiffies + HZ);

}


void getCPU(struct seq_file *archivo){
    seq_printf(archivo, "%ld,%ld,,,,\n", idle_current, total_current);
}


static int escribir(struct seq_file *archivo, void *v)
{   
    getCPU(archivo);
    getProcesses(&init_task, archivo); 
    return 0;
}

static int abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir, NULL);
}


static struct proc_ops operaciones =
{
    .proc_open = abrir,
    .proc_read = seq_read
};

static int _insert(void)
{   

    timer_setup(&timer, timer_callback, 0);
    mod_timer(&timer, jiffies + HZ);

    proc_create("cpu_202010055", 0, NULL, &operaciones);
    printk(KERN_INFO "Derek Esquivel\n");
    return 0;
}

static void _remove(void)
{
    // timer_delete(&timer);

    del_timer(&timer);

    
    remove_proc_entry("cpu_202010055", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
    
}

module_init(_insert);
module_exit(_remove);