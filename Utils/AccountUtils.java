package com.example.SkinCareSellProductSysterm.Utils;

@Component
public class AccountUtils implements ApplicationContextAware {

    private static UserRepository userRepository;
//
//    @Override
//    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
//        userRepository = applicationContext.getBean(UserRepository.class);
//    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        userRepository = applicationContext.getBean(UserRepository.class);
    }

    public User getUser(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
